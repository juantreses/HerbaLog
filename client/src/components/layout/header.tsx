import { useLocation, Link } from "wouter";

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
                                        <Link
                                            href={item.path}
                                            className="text-secondary-400 hover:text-primary"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
            </div>
        </header>
    );
}
