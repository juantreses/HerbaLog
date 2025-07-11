import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import {Express} from "express";
import session from "express-session";
import {scrypt, randomBytes, timingSafeEqual} from "crypto";
import {promisify} from "util";
import {FullUser as SelectUser} from "@db/schema/users/users.ts";
import {storage} from "./storage";

declare global {
    namespace Express {
        interface User extends SelectUser {
        }
    }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "herbalife-inventory-secret-key",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        }
    };

    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            async (email, password, done) => {
                try {
                    const user = await storage.users.byEmail(email);
                    if (!user || !(await comparePasswords(password, user.password))) {
                        return done(null, false);
                    } else {
                        return done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        ),
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.users.byId(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            const existingUser = await storage.users.byEmail(req.body.email);
            if (existingUser) {
                return res.status(400).send("Email already in use");
            }

            const user = await storage.users.create({
                ...req.body,
                password: await hashPassword(req.body.password),
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(user);
            });
        } catch (error) {
            next(error);
        }
    });

    app.post("/api/login", async (req, res, next) => {
        try {
            // Validate required fields
            if (!req.body || !req.body.email || !req.body.password) {
                return res.status(400).json({message: "Email and password are required"});
            }

            // Check if the user exists first, for debugging
            const userExists = await storage.users.byEmail(req.body.email);

            if (!userExists) {
                return res.status(401).json({message: "Invalid email or password"});
            }

            passport.authenticate("local", (err: Error | null, user: Express.User | false, info: any) => {
                if (err) {
                    console.error("Login error:", err);
                    return next(err);
                }

                if (!user) {
                    return res.status(401).json({message: "Invalid email or password"});
                }

                req.login(user, (err: Error | null) => {
                    if (err) {
                        console.error("Login session error:", err);
                        return next(err);
                    }
                    return res.status(200).json(user);
                });
            })(req, res, next);
        } catch (error) {
            console.error("Unexpected error during login:", error);
            return res.status(500).json({message: "Internal server error"});
        }
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
