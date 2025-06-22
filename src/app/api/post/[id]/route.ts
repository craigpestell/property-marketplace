import { NextResponse } from 'next/server';


import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    console.log('GET POST')
    console.log('url', request.url)
    const { searchParams } = new URL(request.url);
    const postId = request.url.split('/').pop()
    
    const where: any = {id: postId};
    
    const post = await prisma.post.findUnique({
      where,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,  // Keep this only if you've added it to your schema
        category: true,
        tags: true,
        readTime: true,
        viewCount: true,
        commentCount: true,
        authorId: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}