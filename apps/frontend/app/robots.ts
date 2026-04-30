import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // закриваємо адмінку від пошуку
    },
    sitemap: 'https://it-blog-news.pp.ua/sitemap.xml',
  }
}