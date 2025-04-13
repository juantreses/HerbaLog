import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-2xl font-semibold mb-2">{title}</h1>
                {description && <p className="text-secondary-500">{description}</p>}
            </div>
            {children && <div className="flex space-x-2">{children}</div>}
        </div>
    );
}
