import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths(), mkcert()],
    server: {
        https: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5288',
                secure: false,
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'build',
    },
});