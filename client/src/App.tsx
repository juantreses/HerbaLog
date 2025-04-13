import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import {Toaster} from "@/components/ui/toaster.tsx";
import NotFound from "@/pages/not-found.tsx";
import AuthPage from "@/pages/auth-page.tsx";
import Dashboard from "@/pages/dashboard.tsx";

function Router() {
    return (
        <AuthProvider>
            <Switch>
                <Route path="/auth" component={AuthPage} />
                <ProtectedRoute path="/" component={Dashboard} />
                <Route component={NotFound} />
            </Switch>
        </AuthProvider>
    );
}

function App() {
    return (
        <>
            <Router />
            <Toaster />
        </>
    );
}

export default App;
