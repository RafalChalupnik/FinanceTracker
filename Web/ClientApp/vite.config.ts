import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command }) => {
    // Use a conditional base path.
    // In development ('serve'), it will be '/', the default.
    // In production ('build'), it will be './' for relative paths.
    const base = command === 'build' ? './' : '/';

    return {
        base: base,
        plugins: [react(), tsconfigPaths()],
        server: {
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
    };
});