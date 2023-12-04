import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// '@': path.resolve(__dirname, './src'),
			// src: path.resolve(__dirname, './src'), // Adjusted the path here
			// comp: path.resolve(__dirname, './src/views/components'),
			// pages: path.resolve(__dirname, './src/views/pages'),
			// core: path.resolve(__dirname, './src/core'),
			// assets: path.resolve(__dirname, './src/assets'),
		},
	},
});
