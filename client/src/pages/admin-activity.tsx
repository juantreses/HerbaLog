import {useAuth} from "@/hooks/use-auth.tsx";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Calendar, CirclePlus, Filter, RotateCcw} from "lucide-react";
import {AdminActivity, AdminActivityRecord} from "@shared/db/schema/admin/activities.ts";
import PageHeader from "@/components/layout/page-header.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {FullUser} from "@shared/db/schema/users/users.ts";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";

export default function AdminActivityPage() {
    const {user} = useAuth();
    const [page, setPage] = useState(1);
    const pageSize = 4;

    const {data, isLoading} = useQuery({
        queryKey: ["/api/admin-activities", page, pageSize],
        queryFn: async () => {
            const url = new URL("/api/admin-activities", window.location.origin);
            url.searchParams.append("page", page.toString());
            url.searchParams.append("pageSize", pageSize.toString());

            const res = await fetch(url.toString(), {credentials: "include"});
            if (!res.ok) throw new Error("Failed to load activities");
            return res.json();
        },
        enabled: !!user
    });

    const activities = data?.activities ?? [];
    const totalCount = data?.totalCount ?? 0;

    const pageCount = Math.ceil(totalCount / pageSize);

    const getActivityIcon = (action: string) => {
        switch (action) {
            case AdminActivity.CREATED_CATEGORY:
                return <CirclePlus className="h-5 w-5 text-primary"/>;
            default:
                return <RotateCcw className="h-5 w-5 text-secondary-500"/>;
        }
    }

    const getActivityDescription = (activity: any) => {
        const details = activity.details;

        switch (activity.action) {
            case AdminActivity.CREATED_CATEGORY:
                return `Heeft categorie "${details.categoryName}" aangemaakt`;
            default:
                return `Heeft actie uitgevoerd: ${activity.action}`;
        }
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <>
            <PageHeader
                title="Activiteit"
                description="Bekijk de activiteiten die zijn uitgevoerd door beheerders."
            >
                <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4"/>
                    Filter
                </Button>

                <Button variant="outline" className="gap-1">
                    <Calendar className="h-4 w-4"/>
                    Datum
                </Button>
            </PageHeader>

            <Card>
                <CardHeader>
                    <CardTitle>Activiteitenlog</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Admin activiteit laden...</div>
                    ) : !activities || activities.length === 0 ? (
                        <div className="text-center py-8 text-secondary-500">
                            <RotateCcw className="h-12 w-12 mx-auto mb-4 text-secondary-300"/>
                            <p className="text-lg font-medium">Geen activiteiten gevonden</p>
                            <p className="mt-2">Er werden nog geen acties geregistreerd.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activities.map((activity: AdminActivityRecord & { user: FullUser }) => (
                                <div key={activity.id} className="flex border-b pb-6 last:border-0 last:pb-0">
                                    {/* Icoon */}
                                    <div className="flex-shrink-0 mr-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center">
                                            {getActivityIcon(activity.action)}
                                        </div>
                                    </div>

                                    {/* Inhoud */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">
                    <span className="text-primary">
                      {activity.user.firstName} {activity.user.lastName}
                    </span>{" "}
                                                    {getActivityDescription(activity)}
                                                </p>
                                                <p className="text-sm text-secondary-400 mt-1">
                                                    {formatDate(activity.timestamp)}
                                                </p>
                                            </div>
                                            <div className="text-sm text-secondary-400 whitespace-nowrap">
                                                {activity.action.replace(/_/g, " ")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(page - 1);
                                            }}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({length: pageCount}).map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage(pageNum);
                                                    }}
                                                    isActive={pageNum === page}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < pageCount) setPage(page + 1);
                                            }}
                                            className={page >= pageCount ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>);
}