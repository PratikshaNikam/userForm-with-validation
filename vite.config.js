import { defineConfig,loadEnv  } from 'vite'
import react from '@vitejs/plugin-react';
  

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': loadEnv('development', process.cwd(), {}), // Example with development mode
},
})


