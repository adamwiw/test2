import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Better chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.js$/, '') : 'chunk'
          return `chunks/${facadeModuleId}-[hash].js`
        }
      }
    },
    // Code splitting optimizations
    manualChunks: {
      vendor: ['react', 'react-dom'],
      three: ['three', '@react-three/fiber', '@react-three/drei'],
      gsap: ['gsap']
    },
    // Compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Preview optimizations
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  }
})
