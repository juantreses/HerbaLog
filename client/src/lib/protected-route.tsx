import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export function ProtectedRoute({
                                   path,
                                   component: Component,
                               }: {
    path: string;
    component: () => React.JSX.Element;
}) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Route path={path}>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Route>
        );
    }

    if (!user) {
        return (
            <Route path={path}>
                <Redirect to="/auth" />
            </Route>
        );
    }

    return (
        <Route path={path}>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-64 transition-all duration-300">
                    <Header />
                    <div className="p-6">
                        <Component />
                    </div>
                </div>
            </div>
        </Route>
    );
}
