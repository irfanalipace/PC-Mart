import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Determine the directory of the current module
const __dirname = path.resolve(new URL('.', import.meta.url).pathname);

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src'), // Adjusted the path here
			comp: path.resolve(__dirname, 'src/views/components'),
			pages: path.resolve(__dirname, 'src/views/pages'),
			core: path.resolve(__dirname, 'src/core'),
			assets: path.resolve(__dirname, 'src/assets'),
		},
	},
});
