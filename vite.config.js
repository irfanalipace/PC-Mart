import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src/'), // You can set up your own aliases here
			comp: path.resolve(__dirname, './src/views/components'),
			pages: path.resolve(__dirname, './src/views/pages'),
			core: path.resolve(__dirname, './src/core'),
			assets: path.resolve(__dirname, './src/assets'),
		},
	},
});
