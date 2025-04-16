import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "@/components/layout/page-header";
import {Search} from "lucide-react";
import {useAuth} from "@/hooks/use-auth.tsx";
import {Input} from "@/components/ui/input.tsx";
import CategoryForm from "@/components/forms/category-form.tsx";

export default function CategoriesPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState("");

    const { data: categories, isLoading } = useQuery({
        queryKey: ["/api/categories"],
        queryFn: async () => {
            const res = await fetch("/api/categories", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to load categories");
            return res.json();
        },
        enabled: !!user
    });

    const filteredCategories = categories ?
        categories.filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) : []

    const createCategory = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: newCategory }),
            });
            if (!res.ok) throw new Error("Failed to create category");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            setNewCategory("");
        },
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to delete category");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
        },
    });

    return (
        <>
            <PageHeader title={"Product Categorieën"}>
                <div className="flex space-x-2">
                    <CategoryForm />
                </div>
            </PageHeader>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <Input
                        placeholder={"Zoek categorieën..."}
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="pt-6">
                {isLoading ? (
                    <div className="text-center py-10">Productcategorieën laden...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-medium">Geen productcategorieën gevonden</h3>
                        <p className="text-secondary-500 mt-2">
                            {searchQuery ? "Probeer een andere zoekterm" : "Voeg de eerste categorie toe om van start te gaan"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCategories.map((category: any) => (
                            <div key={category.id} className="bg-white shadow-md rounded-lg p-4">
                                <h3 className="text-lg font-medium">{category.name}</h3>
                                <p className="text-secondary-500 mt-2">{category.description}</p>
                                <button
                                    onClick={() => deleteCategory.mutate(category.id)}
                                    className="mt-4 text-red-500 hover:text-red-700"
                                >
                                    Verwijder
                                </button>
                            </div>
                        ))}
                    </div>
                    )}
            </div>
        </>
    );
}
