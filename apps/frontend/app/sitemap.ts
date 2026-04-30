import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://it-blog-news.pp.ua'
  const API_URL = process.env.BACKEND_URL || 'http://localhost:3001'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    // Fetch articles
    const articlesRes = await fetch(`${API_URL}/api/articles`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })
    
    if (articlesRes.ok) {
      const articlesData = await articlesRes.json()
      const articles = articlesData.data || articlesData.rows || []
      
      const articlePages = articles
        .filter((article: any) => article.slug && article.category?.slug && article.published_at)
        .map((article: any) => ({
          url: `${baseUrl}/${article.category.slug}/${article.slug}`,
          lastModified: new Date(article.updated_at || article.published_at || article.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      
      dynamicPages.push(...articlePages)
    }
  } catch (error) {
    console.error('Помилка отримання статей для sitemap:', error)
  }

  try {
    // Fetch categories
    const categoriesRes = await fetch(`${API_URL}/api/categories`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })
    
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json()
      const categories = categoriesData.data || categoriesData || []
      
      const categoryPages = categories
        .filter((category: any) => category.slug)
        .map((category: any) => ({
          url: `${baseUrl}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      
      dynamicPages.push(...categoryPages)
    }
  } catch (error) {
    console.error('Помилка отримання категорій для sitemap:', error)
  }

  try {
    // Fetch tags
    const tagsRes = await fetch(`${API_URL}/api/tags`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })
    
    if (tagsRes.ok) {
      const tagsData = await tagsRes.json()
      const tags = tagsData.data || tagsData || []
      
      const tagPages = tags
        .filter((tag: any) => tag.slug)
        .map((tag: any) => ({
          url: `${baseUrl}/tags/${tag.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        }))
      
      dynamicPages.push(...tagPages)
    }
  } catch (error) {
    console.error('Помилка отримання тегів для sitemap:', error)
  }

  return [...staticPages, ...dynamicPages]
}