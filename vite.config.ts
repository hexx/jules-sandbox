import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import * as path from "path"; // Not using Node's path directly for Deno

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // We expect deno.jsonc import map to handle these aliases primarily.
      // Vite might pick them up. If not, relative paths or direct
      // use of the deno.jsonc aliases in imports (e.g. "@/lib/utils") is the way.
      // { find: '@/', replacement: new URL('./src/', import.meta.url).pathname }
      // The above line is a more Deno-idiomatic way if direct path resolution in Vite is needed,
      // but can be problematic depending on how Vite's resolver interacts with Deno's fs.
      // For now, primarily relying on deno.jsonc.
    ],
  },
})
