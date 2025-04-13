import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react(), themePlugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'client', 'src'),
            '@shared': path.resolve(__dirname, 'shared'),
            '@assets': path.resolve(__dirname, 'attached_assets'),
        },
    },
    root: path.resolve(__dirname, 'client'),
    build: {
        outDir: path.resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
    },
});
