import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import {Toaster} from "@/components/ui/toaster.tsx";
import NotFound from "@/pages/not-found.tsx";
import AuthPage from "@/pages/auth-page.tsx";
import Dashboard from "@/pages/dashboard.tsx";
import CategoriesPage from "@/pages/product-categories.tsx";
import AdminActivityPage from "@/pages/admin-activity.tsx";

function Router() {
    return (
        <AuthProvider>
            <Switch>
                <Route path="/auth" component={AuthPage} />
                <ProtectedRoute path="/" component={Dashboard} />
                <ProtectedRoute path="/admin/categories" component={CategoriesPage} />
                <ProtectedRoute path="/admin/activities" component={AdminActivityPage} />
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
