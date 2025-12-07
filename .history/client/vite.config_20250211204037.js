import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})







// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     hmr: {
//       protocol: 'ws', // Use WebSocket for HMR
//       host: 'localhost', // Hostname
//       port: 3000, // Port for WebSocket
//     },
//   },
// })
