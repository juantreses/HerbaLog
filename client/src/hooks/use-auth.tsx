import {createContext, ReactNode, useContext} from "react";
import {useMutation, UseMutationResult, useQuery,} from "@tanstack/react-query";
import {InsertUser, FullUser as SelectUser} from '@shared/db/schema/users/users.ts'
import {apiRequest, queryClient} from "@/lib/QueryClient.ts";
import {useToast} from "@/hooks/use-toast.ts";

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
            const res = await fetch(queryKey[0] as string, {
                credentials: "include",
            });

            if (res.status === 401) {
                return null;
            }

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`${res.status}: ${text || res.statusText}`);
            }

            return await res.json();
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const loginMutation = useMutation<SelectUser, Error, LoginData>({
        mutationFn: async (credentials: LoginData) => {
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

                return await res.json();
            } catch (error) {
                console.error("Login error details:", error);
                throw error;
            }
        },
        onSuccess: (user: SelectUser) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Succesvol ingelogd",
                description: `Welkom terug, ${user.firstName}!`,
            });
            // Force a refetch of the user data to ensure it's properly refreshed
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            // Redirect to dashboard after successful login
            window.location.href = "/";
        },
        onError: (error: Error) => {
            console.error("Login error:", error);
            toast({
                title: "Login mislukt",
                description: error.message || "Je inloggegevens kloppen niet. Probeer het opnieuw.",
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation<SelectUser, Error, RegisterData>({
        mutationFn: async (data: RegisterData) => {
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
                    throw new Error(errorText || "Registratie mislukt");
                }

                return await res.json();
            } catch (error) {
                console.error("Registration error details:", error);
                throw error;
            }
        },
        onSuccess: (user: SelectUser) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({
                title: "Yes! Je bent nu geregistreerd",
                description: `Welkom bij HerbaLog, ${user.firstName}!`,
            });
            // Force a refetch of the user data to ensure it's properly refreshed
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            // Redirect to dashboard after successful registration
            window.location.href = "/";
        },
        onError: (error: Error) => {
            console.error("Registration error:", error);
            toast({
                title: "Hmm... er ging iets fout bij het registreren.",
                description: error.message || "Er ging iets fout bij het aanmaken van je account. Probeer het opnieuw.",
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
                title: "Je bent uitgelogd. Tot snel!",
                description: "Je bent succesvol uitgelogd uit je account.",
            });
            // Redirect to login page after logout
            window.location.href = "/auth";
        },
        onError: (error: Error) => {
            toast({
                title: "Het is niet gelukt om uit te loggen",
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
