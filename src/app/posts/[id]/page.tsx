'use client';

import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Post, usePost } from '@/hooks/usePost';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Hero from '@/components/Hero';

export default function PostPage() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    const postId = pathname.split('/').pop();
    const {
        data: post,
        isLoading,
        error,
    } = usePost(
        postId as string
    );

    return (
    <div className="bg-[var(--background)] min-h-screen">
    
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-[var(--destructive)] text-lg mb-4">
              Error loading posts: {error.message}
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        ): (
            <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            excerpt={
                post.excerpt || post.content.substring(0, 120) + '...'
            }
            authorId={post.authorId}
            authorName={post.authorName}
            authorImage={post.authorImage}
            createdAt={post.createdAt}
            coverImage={post.coverImage}
            category={post.category}
            tags={post.tags}
            readTime={post.readTime || 3}
            commentCount={post.commentCount || 0}
            viewCount={post.viewCount || 0}
            />                        
        )}
    </div>
    )
}