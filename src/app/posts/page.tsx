'use client';

import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Post, usePosts } from '@/hooks/usePosts';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const categories = [
  'All',
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Health',
];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const {
    data: posts,
    isLoading,
    error,
  } = usePosts(
    debouncedQuery,
    selectedCategory !== 'All' ? selectedCategory : undefined,
    sortBy
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'popular', label: 'Most popular' },
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen">
      

      {/* Filters */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              Categories:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/[0.9]'
                      : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              Sort by:
            </span>
            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center gap-1 px-3 py-1.5 border border-[var(--border)] rounded-md bg-[var(--card)] text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                {sortBy === 'newest'
                  ? 'Newest'
                  : sortBy === 'oldest'
                    ? 'Oldest'
                    : 'Popular'}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isSortMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-lg z-10">
                  {sortOptions.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={() => {
                          setSortBy(option.value);
                          setIsSortMenuOpen(false);
                        }}
                        className="mr-2 h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts grid */}
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
        ) : posts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
              No posts found
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : selectedCategory !== 'All'
                  ? `No posts in the "${selectedCategory}" category`
                  : 'No posts available at the moment'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {posts.map(
                (
                  post: Post & {
                    category?: string;
                    tags?: string[];
                    excerpt?: string;
                    coverImage?: string;
                    authorName?: string;
                    authorImage?: string;
                    readTime?: number;
                    commentCount?: number;
                    viewCount?: number;
                  }
                ) => (
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
                )
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {posts && posts.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="mr-2">
              Previous
            </Button>
            <Button variant="outline">Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}