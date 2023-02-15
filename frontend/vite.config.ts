import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		proxy: {
			'/Api': {
				target: 'http://127.0.0.1:4565',
				ws: true,
				changeOrigin: true
			},
			'/api': {
				target: 'http://127.0.0.1:4565',
				ws: true,
				changeOrigin: true
			}
		}
	}
});
