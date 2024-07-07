import react from '@vitejs/plugin-react-swc'
import { InsertAxeScriptVite } from 'axe-dev-tooltip'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),InsertAxeScriptVite('en')],
})
