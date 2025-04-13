import { createContext, ReactNode, useContext } from "react";
import {
    useQuery,
    useMutation,
    UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from '@shared/schema'
import { apiRequest, queryClient } from "../lib/queryClient";
import {useToast} from "./use-toast";

type AuthContextType = {
    user: SelectUser | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
    logoutMutation: UseMutationResult<void, Error, void>;
    registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = {
    email: string;
    password: string;
};

interface RegisterData extends Omit<InsertUser, "role"> {
    role?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const {
        data: user,
        error,
        isLoading,
    } = useQuery<SelectUser | null, Error>({
        queryKey: ["/api/user"],
        queryFn: async ({ queryKey }) => {
            console.log("Fetching user data from", queryKey[0]);
            const res = await fetch(queryKey[0] as string, {
                credentials: "include",
            });

            console.log("User API response status:", res.status);

            if (res.status === 401) {
                console.log("User not authenticated");
                return null;
            }

            if (!res.ok) {
                const text = await res.text();
                console.error("Error fetching user:", text || res.statusText);
                throw new Error(`${res.status}: ${text || res.statusText}`);
            }

            const userData = await res.json();
            console.log("User data received:", userData);
            return userData;
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const loginMutation = useMutation<SelectUser, Error, LoginData>({
        mutationFn: async (credentials: LoginData) => {
            console.log("Logging in with:", credentials.email);
            try {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                    credentials: "include"
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Login error response:", res.status, errorText);
                    throw new Error(errorText || "Invalid credentials");
                }

                const userData = await res.json();
                console.log("Login response:", userData);
                return userData;
            } catch (error) {
                console.error("Login error details:", error);
                throw error;
            }
        },
        onSuccess: (user: SelectUser) => {
            console.log("Login successful, setting user data:", user);
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Logged in successfully",
                description: `Welcome back, ${user.name}!`,
            });
            // Force a refetch of the user data to ensure it's properly refreshed
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            // Redirect to dashboard after successful login
            window.location.href = "/";
        },
        onError: (error: Error) => {
            console.error("Login error:", error);
            toast({
                title: "Login failed",
                description: error.message || "Invalid credentials. Please try again.",
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation<SelectUser, Error, RegisterData>({
        mutationFn: async (data: RegisterData) => {
            console.log("Registering with:", data.email);
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    credentials: "include"
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Registration error response:", res.status, errorText);
                    throw new Error(errorText || "Registration failed");
                }

                const userData = await res.json();
                console.log("Registration response:", userData);
                return userData;
            } catch (error) {
                console.error("Registration error details:", error);
                throw error;
            }
        },
        onSuccess: (user: SelectUser) => {
            console.log("Registration successful, setting user data:", user);
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Registration successful",
                description: `Welcome to HerbaInventory, ${user.name}!`,
            });
            // Force a refetch of the user data to ensure it's properly refreshed
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            // Redirect to dashboard after successful registration
            window.location.href = "/";
        },
        onError: (error: Error) => {
            console.error("Registration error:", error);
            toast({
                title: "Registration failed",
                description: error.message || "Could not create account. Please try again.",
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation<void, Error, void>({
        mutationFn: async () => {
            await apiRequest("POST", "/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account.",
            });
            // Redirect to login page after logout
            window.location.href = "/auth";
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
