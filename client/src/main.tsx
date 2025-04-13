import {createRoot} from "react-dom/client";
import "./index.css";
import {QueryClientProvider} from "@tanstack/react-query";
import App from "@/App.tsx";
import {queryClient} from "@/lib/QueryClient.ts";

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
);
