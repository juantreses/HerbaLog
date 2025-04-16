import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
    LayoutDashboard,
    ShoppingBag,
    LogOut,
    FolderKanban, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {hasFeature} from "@shared/permissions.ts";
import {Role} from "@shared/roles.ts";

export default function Sidebar() {
    const [location] = useLocation();
    const { user, logoutMutation } = useAuth();

    const isActive = (path: string) => location === path;

    const sidebarItems = [
        { icon: LayoutDashboard, text: "Dashboard", path: "/" },
    ];

    const getAdminItems = (role: Role | undefined) => {
    const items = [];
    if (hasFeature(role, "manageProducts")) {
        items.push({ icon: ShoppingBag, text: "Producten", path: "/admin/products" });
        items.push({ icon: FolderKanban, text: "Categorieën", path: "/admin/categories" });
        items.push({ icon: Clock, text: "Activiteit", path: "/admin/activities" });
    }
    // Add more features here as needed
    return items;
};

const adminItems = getAdminItems(user?.role);

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <aside className="sidebar fixed h-full bg-white shadow-md w-64 transition-all duration-300 z-10">
            <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                        <ShoppingBag size={20} />
                    </div>
                    <h1 className="text-lg font-semibold text-primary">HerbaLog</h1>
                </div>
            </div>

            <nav className="mt-6">
                <div className="px-4 mb-2">
                    <p className="text-xs font-medium text-secondary-400 uppercase tracking-wider">MAIN</p>
                </div>

                <ul>
                    {sidebarItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.path}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm",
                                    isActive(item.path)
                                        ? "bg-primary text-white"
                                        : "hover:bg-primary-50 text-secondary-700"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                <span className="sidebar-text">{item.text}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {adminItems.length > 0 && (
                    <>
                        <div className="px-4 mt-6 mb-2">
                            <p className="text-xs font-medium text-secondary-400 uppercase tracking-wider">ADMIN</p>
                        </div>

                        <ul>
                            {adminItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.path}
                                        className={cn(
                                            "flex items-center px-4 py-3 text-sm",
                                            isActive(item.path)
                                                ? "bg-primary text-white"
                                                : "hover:bg-primary-50 text-secondary-700"
                                        )}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        <span className="sidebar-text">{item.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </nav>

            <div className="absolute bottom-0 w-full border-t p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                            {user?.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.firstName}</p>
                            <p className="text-xs text-secondary-400">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
