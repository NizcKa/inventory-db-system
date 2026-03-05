import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            external: [
                'sqlite3',      // don't bundle sqlite3
                'electron'      // also keep electron as external
            ]
        }
    }
});
