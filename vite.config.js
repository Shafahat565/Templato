import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


const isGH = process.env.NODE_ENV === 'production'
// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    
    tailwindcss(),
    react()],
     base: isGH ? '/Templato' : '/',
  

   
   
})
