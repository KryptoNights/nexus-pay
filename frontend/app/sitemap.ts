import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.nexuspaylink.com/',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: 'https://www.nexuspaylink.com/login',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://www.nexuspaylink.com/dashboard',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: 'https://www.nexuspaylink.com/transactions',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.4,
        },
        {
            url: 'https://www.nexuspaylink.com/docs',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://www.nexuspaylink.com/profile',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.2,
        },
        {
            url: 'https://www.nexuspaylink.com/requests',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://www.nexuspaylink.com/insights',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.3,
        },
    ]
}