// src/environments/environment.ts

export const environment = {
  production: false, // Aunque apunte a Render, lo dejamos en false para el desarrollo local
  apiBaseUrl: 'https://wumena-1.onrender.com/api', // <--- ¡AQUÍ la URL de tu API de Laravel en Render!
  pusher: {
    key: 'd4f1c43f2ff56e3f1839', // <--- Tu KEY real de Pusher.com
    cluster: 'eu', // <--- Tu CLUSTER real de Pusher.com
    forceTLS: true, // Siempre usar TLS/SSL, incluso en desarrollo local si apuntas a Render
  },
};