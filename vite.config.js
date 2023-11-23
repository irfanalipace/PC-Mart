import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			src: '/src', // You can set up your own aliases here
			comp: '/src/views/components',
			pages: '/src/views/pages',
			core: '/src/core',
			assets: '/src/assets',
		},
	},
});
