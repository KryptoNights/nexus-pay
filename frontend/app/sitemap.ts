import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://nexuspay.vercel.app/',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: 'https://nexuspay.vercel.app/login',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://nexuspay.vercel.app/dashboard',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: 'https://nexuspay.vercel.app/transactions',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.4,
        },
        {
            url: 'https://nexuspay.vercel.app/docs',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://nexuspay.vercel.app/profile',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.2,
        },
        {
            url: 'https://nexuspay.vercel.app/requests',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://nexuspay.vercel.app/insights',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.3,
        },
    ]
}