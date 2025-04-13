import { useLocation, Link } from "wouter";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BreadcrumbItem {
    label: string;
    path: string;
    isActive?: boolean;
}

export default function Header() {
    const [location] = useLocation();

    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const paths = location.split('/').filter(Boolean);

        // Always start with home
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', path: '/' }
        ];

        // Add each path segment
        if (paths.length) {
            let currentPath = '';

            paths.forEach((path, index) => {
                currentPath += `/${path}`;
                const isLast = index === paths.length - 1;

                breadcrumbs.push({
                    label: path.charAt(0).toUpperCase() + path.slice(1),
                    path: currentPath,
                    isActive: isLast
                });
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
                <div>
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm">
                            {breadcrumbs.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    {index > 0 && <span className="text-secondary-400 mx-1">/</span>}
                                    {item.isActive ? (
                                        <span className="text-secondary-600 font-medium">{item.label}</span>
                                    ) : (
                                        <Link href={item.path}>
                                            <a className="text-secondary-400 hover:text-primary">{item.label}</a>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" aria-label="Search">
                        <Search className="h-5 w-5 text-secondary-500" />
                    </Button>

                    <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                        <Bell className="h-5 w-5 text-secondary-500" />
                        <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]" variant="default">
                            3
                        </Badge>
                    </Button>

                    <Button variant="ghost" size="icon" aria-label="Help">
                        <HelpCircle className="h-5 w-5 text-secondary-500" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
