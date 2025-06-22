'use client';

import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function PostPage() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    
    return <p>Post: {pathname}</p>
}