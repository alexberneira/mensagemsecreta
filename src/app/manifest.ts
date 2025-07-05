import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inbox Secreta - Mensagens Anônimas',
    short_name: 'Inbox Secreta',
    description: 'Receba mensagens anônimas de forma segura e divertida',
    start_url: '/',
    display: 'standalone',
    background_color: '#111111',
    theme_color: '#8B5CF6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['social', 'communication', 'entertainment'],
    lang: 'pt-BR',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
    prefer_related_applications: false,
  }
} 