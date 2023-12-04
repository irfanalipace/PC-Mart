import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			src: path.resolve('./src/'), // You can set up your own aliases here
			comp: path.resolve('./src/views/components'),
			pages: path.resolve('./src/views/pages'),
			core: path.resolve('./src/core'),
			assets: path.resolve('./src/assets'),
		},
	},
});
