import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/_next/',
        '/admin/',
        '/private/',
      ],
    },
    sitemap: 'https://inboxsecreta.com/sitemap.xml',
  }
} 