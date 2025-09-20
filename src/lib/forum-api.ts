// Forum API functions for database integration
// This file contains all the API calls needed for forum functionality

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  likes: number;
  dislikes: number;
  views: number;
  timeAgo: string;
  hasVoiceNote: boolean;
  language: string;
  tags: string[];
  isBookmarked: boolean;
  isLiked: boolean;
  isDisliked: boolean;
  authorReputation: number;
  isVerified: boolean;
  images: string[];
  whatsappGroupJoined: boolean;
  replies: ForumReply[];
}

export interface ForumReply {
  id: number;
  author: string;
  authorId: string;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  replies: ForumReply[];
}

// API Functions for Posts
export const forumApi = {
  // Get all forum posts
  async getPosts(): Promise<ForumPost[]> {
    try {
      const response = await fetch('http://localhost:3001/api/forum/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Create a new post
  async createPost(postData: {
    title: string;
    content: string;
    category: string;
    language: string;
    hasVoiceNote: boolean;
    images: string[];
  }): Promise<ForumPost> {
    try {
      const response = await fetch('http://localhost:3001/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to create post');
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post likes/dislikes
  async updatePostLikes(postId: number, action: 'like' | 'dislike'): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error('Failed to update likes');
    } catch (error) {
      console.error('Error updating likes:', error);
      throw error;
    }
  },

  // Bookmark/unbookmark a post
  async toggleBookmark(postId: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/bookmark`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle bookmark');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  },

  // Report a post
  async reportPost(postId: number, reason: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to report post');
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },

  // API Functions for Comments/Replies
  async addCommentToPost(postId: number, content: string): Promise<ForumReply> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async updateReplyLikes(postId: number, replyId: number, action: 'like' | 'dislike'): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/comments/${replyId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error('Failed to update reply likes');
    } catch (error) {
      console.error('Error updating reply likes:', error);
      throw error;
    }
  },

  async deleteReply(postId: number, replyId: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/comments/${replyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete reply');
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  },

  // WhatsApp Group Integration
  async joinWhatsAppGroup(postId: number): Promise<void> {
    try {
      const response = await fetch(`http://localhost:3001/api/forum/posts/${postId}/join-whatsapp`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to join WhatsApp group');
    } catch (error) {
      console.error('Error joining WhatsApp group:', error);
      throw error;
    }
  },

  // Search and Filter Functions
  async searchPosts(query: string, filters: {
    category?: string;
    language?: string;
    sortBy?: string;
  }): Promise<ForumPost[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });
      
      const response = await fetch(`http://localhost:3001/api/forum/search?${params}`);
      if (!response.ok) throw new Error('Failed to search posts');
      return await response.json();
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
};

// Database Schema (for reference)
export const forumDatabaseSchema = {
  posts: {
    id: 'serial PRIMARY KEY',
    title: 'varchar(255) NOT NULL',
    content: 'text NOT NULL',
    author_id: 'varchar(100) NOT NULL',
    author_name: 'varchar(100) NOT NULL',
    category: 'varchar(100) NOT NULL',
    language: 'varchar(50) NOT NULL',
    has_voice_note: 'boolean DEFAULT false',
    images: 'jsonb DEFAULT \'[]\'',
    tags: 'jsonb DEFAULT \'[]\'',
    likes_count: 'integer DEFAULT 0',
    dislikes_count: 'integer DEFAULT 0',
    views_count: 'integer DEFAULT 0',
    author_reputation: 'integer DEFAULT 100',
    is_verified: 'boolean DEFAULT false',
    whatsapp_group_joined: 'boolean DEFAULT false',
    created_at: 'timestamp DEFAULT NOW()',
    updated_at: 'timestamp DEFAULT NOW()'
  },
  
  post_likes: {
    id: 'serial PRIMARY KEY',
    post_id: 'integer REFERENCES posts(id) ON DELETE CASCADE',
    user_id: 'varchar(100) NOT NULL',
    action: 'varchar(10) NOT NULL CHECK (action IN (\'like\', \'dislike\'))',
    created_at: 'timestamp DEFAULT NOW()',
    UNIQUE: '(post_id, user_id)'
  },
  
  post_bookmarks: {
    id: 'serial PRIMARY KEY',
    post_id: 'integer REFERENCES posts(id) ON DELETE CASCADE',
    user_id: 'varchar(100) NOT NULL',
    created_at: 'timestamp DEFAULT NOW()',
    UNIQUE: '(post_id, user_id)'
  },
  
  comments: {
    id: 'serial PRIMARY KEY',
    post_id: 'integer REFERENCES posts(id) ON DELETE CASCADE',
    author_id: 'varchar(100) NOT NULL',
    author_name: 'varchar(100) NOT NULL',
    content: 'text NOT NULL',
    parent_comment_id: 'integer REFERENCES comments(id) ON DELETE CASCADE',
    likes_count: 'integer DEFAULT 0',
    created_at: 'timestamp DEFAULT NOW()',
    updated_at: 'timestamp DEFAULT NOW()'
  },
  
  comment_likes: {
    id: 'serial PRIMARY KEY',
    comment_id: 'integer REFERENCES comments(id) ON DELETE CASCADE',
    user_id: 'varchar(100) NOT NULL',
    created_at: 'timestamp DEFAULT NOW()',
    UNIQUE: '(comment_id, user_id)'
  },
  
  reports: {
    id: 'serial PRIMARY KEY',
    post_id: 'integer REFERENCES posts(id) ON DELETE CASCADE',
    reporter_id: 'varchar(100) NOT NULL',
    reason: 'varchar(255) NOT NULL',
    status: 'varchar(20) DEFAULT \'pending\' CHECK (status IN (\'pending\', \'reviewed\', \'resolved\'))',
    created_at: 'timestamp DEFAULT NOW()'
  }
};
