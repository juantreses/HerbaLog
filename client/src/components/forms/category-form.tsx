import {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Plus} from "lucide-react";
import {apiRequest} from "@/lib/QueryClient.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";

const formSchema = z.object({
    name: z.string().min(2, "Naam moet minstens 2 tekens bevatten"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    onSuccess?: () => void;
    buttonText?: string;
    initialValues?: Partial<CategoryFormValues>;
}

export default function CategoryForm({
                                         onSuccess,
                                         buttonText = "Categorie toevoegen",
                                         initialValues,
                                     }: CategoryFormProps) {
    const [open, setOpen] = useState(false);
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const defaultValues: Partial<CategoryFormValues> = {
        name: "",
        ...initialValues,
    };

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const mutation = useMutation({
        mutationFn: async (data: CategoryFormValues) => {
            return apiRequest("POST", "/api/categories", data);
        },
        onSuccess: () => {
            toast({
                title: "Succes!",
                description: "Categorie werd succesvol toegevoegd.",
            });
            form.reset(defaultValues);
            queryClient.invalidateQueries({queryKey: ["/api/categories"]});
            setOpen(false);
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            toast({
                title: "Fout",
                description:
                    error.message || "Categorie toevoegen is mislukt. Probeer opnieuw.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = async (values: CategoryFormValues) => {
        const nameCheckUrl = new URL("/api/categories/check-name", window.location.origin);
        nameCheckUrl.searchParams.set("name", values.name);

        const res = await fetch(nameCheckUrl.toString(), { credentials: "include" });
        const { exists } = await res.json();

        if (exists) {
            form.setError("name", {
                type: "manual",
                message: "Deze categorienaam bestaat al.",
            });
            return;
        }

        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-1">
                    <Plus className="h-4 w-4"/>
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Nieuwe categorie toevoegen</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Naam</FormLabel>
                                    <FormControl>
                                        <Input placeholder="bv. Proteïne" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-3 mt-6">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setOpen(false)}
                            >
                                Annuleer
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Toevoegen..." : "Toevoegen"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
