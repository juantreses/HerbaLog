import { useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ShoppingBag, Package, User, Mail, Lock } from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card";
import {useAuth} from '../hooks/use-auth';
import {Button} from "../components/ui/button";

const loginSchema = z.object({
    email: z.string().email("Vul een geldig e-mailadres in"),
    password: z.string()
});

const registerSchema = z.object({
    name: z.string().min(2, "Naam moet minstens 2 karakters lang zijn"),
    email: z.string().email("Vul een geldig e-mailadres in"),
    password: z.string().min(6, "Wachtwoord moet minstens 6 karakters lang zijn"),
    role: z.string().default("distributor"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
    const { user, loginMutation, registerMutation } = useAuth();
    const [, navigate] = useLocation();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const registerForm = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "distributor",
        },
    });

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const onLoginSubmit = async (data: LoginValues) => {
        loginMutation.mutate(data);
    };

    const onRegisterSubmit = (data: RegisterValues) => {
        registerMutation.mutate({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
        });
    };

    // Don't render anything if we're redirecting
    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            <div className="flex items-center justify-center p-8">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <h1 className="ml-3 text-2xl font-bold text-primary">HerbaLog</h1>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Registreer</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Welkom Terug</CardTitle>
                                    <CardDescription>
                                        Log in om je Herbalife inventaris te beheren
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                                                <Mail className="ml-3 h-4 w-4 text-secondary-400" />
                                                                <Input
                                                                    placeholder="you@example.com"
                                                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                                                <Lock className="ml-3 h-4 w-4 text-secondary-400" />
                                                                <Input
                                                                    type="password"
                                                                    placeholder="••••••••"
                                                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={loginMutation.isPending}
                                            >
                                                {loginMutation.isPending ? "Inloggen..." : "Log In"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <p className="text-sm text-secondary-500">
                                        Nog geen account?{" "}
                                        <a
                                            href="#register"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const elem = document.querySelector('[data-value="register"]') as HTMLElement;
                                                if (elem) elem.click();
                                            }}
                                            className="text-primary hover:underline"
                                        >
                                            Register
                                        </a>
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="register">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create an account</CardTitle>
                                    <CardDescription>
                                        Start met HerbaLog en hou je Herbalife-producten moeiteloos bij
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...registerForm}>
                                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                                            <FormField
                                                control={registerForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                                                <User className="ml-3 h-4 w-4 text-secondary-400" />
                                                                <Input
                                                                    placeholder="John Doe"
                                                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                                                <Mail className="ml-3 h-4 w-4 text-secondary-400" />
                                                                <Input
                                                                    placeholder="you@example.com"
                                                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                                                <Lock className="ml-3 h-4 w-4 text-secondary-400" />
                                                                <Input
                                                                    type="password"
                                                                    placeholder="••••••••"
                                                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={registerMutation.isPending}
                                            >
                                                {registerMutation.isPending ? "Account aanmaken..." : "Maak een account aan"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <p className="text-sm text-secondary-500">
                                        Heb je al een account?{" "}
                                        <a
                                            href="#login"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const elem = document.querySelector('[data-value="login"]') as HTMLElement;
                                                if (elem) elem.click();
                                            }}
                                            className="text-primary hover:underline"
                                        >
                                            Sign in
                                        </a>
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="hidden lg:flex bg-primary items-center justify-center p-8 relative overflow-hidden">
                <div className="relative z-10 max-w-md text-white p-8">
                    <h2 className="text-3xl font-bold mb-4">Beheer jouw Herbalife-voorraad eenvoudig</h2>
                    <p className="mb-6">
                        Een complete oplossing voor voorraadbeheer voor Herbalife-distributeurs.
                        Volg je producten op, houd het verbruik bij en deel je voorraad met je huishouden.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                <Package className="h-3 w-3 text-white" />
                            </div>
                            <span>Volg persoonlijk verbruik en promotionele weggeefacties op</span>
                        </li>
                        <li className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                <User className="h-3 w-3 text-white" />
                            </div>
                            <span>Deel je voorraad met je huishouden</span>
                        </li>
                        <li className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                <ShoppingBag className="h-3 w-3 text-white" />
                            </div>
                            <span>Behoud een nauwkeurige voorraad met FIFO-tracering (First In, First Out)</span>
                        </li>
                    </ul>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-80"></div>
                <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-white/10 rounded-tl-full"></div>
                <div className="absolute left-0 top-0 w-1/3 h-1/3 bg-white/10 rounded-br-full"></div>
            </div>
        </div>
    );
}
