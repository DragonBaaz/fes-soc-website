import { MetadataRoute } from 'next'
import { allDepartments } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: replace with actual Vercel deployment URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const staticRoutes = ['/', '/dashboard', '/departments', '/opportunities', '/tracker', '/search', '/framework', '/about'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }))

  const departmentRoutes = allDepartments.map(dept => ({
    url: `${baseUrl}/departments/${dept.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const schemeRoutes = allDepartments.flatMap(dept =>
    dept.schemes.map(scheme => ({
      url: `${baseUrl}/schemes/${scheme.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticRoutes, ...departmentRoutes, ...schemeRoutes]
}
