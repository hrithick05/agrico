const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock database for demonstration
// In production, this would be replaced with actual database calls
let mockPosts = [
  {
    id: 1,
    title: "Best practices for wheat crop in March",
    content: "I've been farming wheat for 10 years and wanted to share some insights about planting in March conditions...",
    author: "Ramesh Kumar",
    authorId: "user1",
    category: "Crop Management",
    likes: 24,
    dislikes: 2,
    views: 156,
    timeAgo: "2 hours ago",
    hasVoiceNote: true,
    language: "Hindi",
    tags: ["wheat", "planting", "march"],
    isBookmarked: false,
    isLiked: false,
    isDisliked: false,
    authorReputation: 1250,
    isVerified: true,
    images: ["wheat-field.jpg"],
    whatsappGroupJoined: false,
    replies: []
  }
];

let mockComments = [
  {
    id: 1,
    postId: 1,
    author: "Suresh Kumar",
    authorId: "user5",
    content: "Great insights! I've been following similar practices for wheat cultivation.",
    timeAgo: "1 hour ago",
    likes: 5,
    isLiked: false,
    replies: []
  }
];

let mockLikes = [];
let mockBookmarks = [];

// Get all forum posts
router.get('/posts', async (req, res) => {
  try {
    // Try to fetch from database first
  try {
      const { data: posts, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

      if (postsError) {
        console.log('Database fetch failed, using mock data:', postsError.message);
        throw postsError;
      }

      // Fetch comments for each post
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          const { data: comments, error: commentsError } = await supabase
            .from('forum_comments')
            .select('*')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

          const formattedComments = comments ? comments.map(comment => ({
            id: comment.id,
            author: comment.author_name,
            authorId: comment.author_id,
            content: comment.content,
            timeAgo: getTimeAgo(comment.created_at),
            likes: comment.likes_count,
            isLiked: false,
            replies: []
          })) : [];

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author_name,
            authorId: post.author_id,
            category: post.category,
            likes: post.likes_count,
            dislikes: post.dislikes_count,
            views: post.views_count,
            timeAgo: getTimeAgo(post.created_at),
            hasVoiceNote: post.has_voice_note,
            language: post.language,
            tags: post.tags || [],
            isBookmarked: false,
            isLiked: false,
            isDisliked: false,
            authorReputation: post.author_reputation,
            isVerified: post.is_verified,
            images: post.images || [],
            whatsappGroupJoined: post.whatsapp_group_joined,
            replies: formattedComments
          };
        })
      );

      res.json(postsWithComments);
      return;
    } catch (dbError) {
      console.log('Using mock data for posts');
    }

    // Fallback to mock data
    const postsWithReplies = mockPosts.map(post => ({
      ...post,
      replies: mockComments.filter(comment => comment.postId === post.id)
    }));
    
    res.json(postsWithReplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Create a new post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, category, language, hasVoiceNote, images } = req.body;
    
    // First, try to insert into database
    try {
      const { data: postData, error: dbError } = await supabase
      .from('forum_posts')
        .insert({
          title: title,
          content: content,
          author_id: "current_user",
          author_name: "Current User",
          category: category || "General",
          likes_count: 0,
          dislikes_count: 0,
          views_count: 0,
          has_voice_note: hasVoiceNote || false,
          language: language || "English",
          tags: content.toLowerCase().match(/\b\w+\b/g)?.slice(0, 5) || [],
          author_reputation: 100,
          is_verified: false,
          images: images || [],
          whatsapp_group_joined: false
        })
        .select()
        .single();

      if (dbError) {
        console.log('Database insert failed, using mock data:', dbError.message);
        throw dbError;
      }

      // Format the response to match frontend expectations
      const formattedPost = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        author: postData.author_name,
        authorId: postData.author_id,
        category: postData.category,
        likes: postData.likes_count,
        dislikes: postData.dislikes_count,
        views: postData.views_count,
        timeAgo: "Just now",
        hasVoiceNote: postData.has_voice_note,
        language: postData.language,
        tags: postData.tags || [],
        isBookmarked: false,
        isLiked: false,
        isDisliked: false,
        authorReputation: postData.author_reputation,
        isVerified: postData.is_verified,
        images: postData.images || [],
        whatsappGroupJoined: postData.whatsapp_group_joined,
        replies: []
      };

      res.json(formattedPost);
      return;
    } catch (dbError) {
      console.log('Using mock data for post creation');
    }
    
    // Fallback to mock data if database fails
    const newPost = {
      id: mockPosts.length + 1,
      title,
      content,
      author: "Current User", // In production, get from auth
      authorId: "current_user",
      category,
      likes: 0,
      dislikes: 0,
      views: 0,
      timeAgo: "Just now",
      hasVoiceNote: hasVoiceNote || false,
      language: language || "English",
      tags: content.toLowerCase().match(/\b\w+\b/g)?.slice(0, 5) || [],
      isBookmarked: false,
      isLiked: false,
      isDisliked: false,
      authorReputation: 100,
      isVerified: false,
      images: images || [],
      whatsappGroupJoined: false,
      replies: []
    };
    
    mockPosts.unshift(newPost);
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post likes/dislikes
router.post('/posts/:id/likes', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { action } = req.body;
    const userId = "current_user"; // In production, get from auth
    
    // First, try to update in database
    try {
      // Check if user already liked/disliked this post
      const { data: existingLike, error: likeError } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (likeError && likeError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.log('Database like check failed, using mock data:', likeError.message);
        throw likeError;
      }

      if (existingLike) {
        if (existingLike.action === action) {
          // Remove the like/dislike
          await supabase
            .from('post_likes')
            .delete()
            .eq('id', existingLike.id);

          // Update post counts
          const updateField = action === 'like' ? 'likes_count' : 'dislikes_count';
          const { data: currentPost } = await supabase
            .from('forum_posts')
            .select(updateField)
            .eq('id', postId)
            .single();
          
          await supabase
            .from('forum_posts')
            .update({ [updateField]: Math.max(0, currentPost[updateField] - 1) })
            .eq('id', postId);
        } else {
          // Change from like to dislike or vice versa
          await supabase
            .from('post_likes')
            .update({ action: action })
            .eq('id', existingLike.id);

          // Update post counts
          const oldField = action === 'like' ? 'dislikes_count' : 'likes_count';
          const newField = action === 'like' ? 'likes_count' : 'dislikes_count';
          
          const { data: currentPost } = await supabase
            .from('forum_posts')
            .select('likes_count, dislikes_count')
            .eq('id', postId)
            .single();
          
          await supabase
            .from('forum_posts')
            .update({ 
              [oldField]: Math.max(0, currentPost[oldField] - 1),
              [newField]: currentPost[newField] + 1
            })
            .eq('id', postId);
        }
      } else {
        // Add new like/dislike
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: userId,
            action: action
          });

        // Update post counts
        const updateField = action === 'like' ? 'likes_count' : 'dislikes_count';
        const { data: currentPost } = await supabase
          .from('forum_posts')
          .select(updateField)
          .eq('id', postId)
          .single();
        
        await supabase
      .from('forum_posts')
          .update({ [updateField]: currentPost[updateField] + 1 })
          .eq('id', postId);
      }

      res.json({ success: true });
      return;
    } catch (dbError) {
      console.log('Using mock data for likes update');
    }
    
    // Fallback to mock data if database fails
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user already liked/disliked this post
    const existingLike = mockLikes.find(l => l.postId === postId && l.userId === userId);
    
    if (existingLike) {
      if (existingLike.action === action) {
        // Remove the like/dislike
        if (action === 'like') {
          post.likes--;
          post.isLiked = false;
        } else {
          post.dislikes--;
          post.isDisliked = false;
        }
        mockLikes = mockLikes.filter(l => l.id !== existingLike.id);
      } else {
        // Change from like to dislike or vice versa
        if (action === 'like') {
          post.dislikes--;
          post.disliked = false;
          post.likes++;
          post.isLiked = true;
        } else {
          post.likes--;
          post.isLiked = false;
          post.dislikes++;
          post.isDisliked = true;
        }
        existingLike.action = action;
      }
    } else {
      // Add new like/dislike
      if (action === 'like') {
        post.likes++;
        post.isLiked = true;
      } else {
        post.dislikes++;
        post.isDisliked = true;
      }
      
      mockLikes.push({
        id: mockLikes.length + 1,
        postId,
        userId,
        action
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Bookmark/unbookmark a post
router.post('/posts/:id/bookmark', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = "current_user"; // In production, get from auth
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const existingBookmark = mockBookmarks.find(b => b.postId === postId && b.userId === userId);
    
    if (existingBookmark) {
      // Remove bookmark
      post.isBookmarked = false;
      mockBookmarks = mockBookmarks.filter(b => b.id !== existingBookmark.id);
    } else {
      // Add bookmark
      post.isBookmarked = true;
      mockBookmarks.push({
        id: mockBookmarks.length + 1,
        postId,
        userId
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

// Report a post
router.post('/posts/:id/report', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { reason } = req.body;
    const reporterId = "current_user"; // In production, get from auth
    
    // In production, save to reports table
    console.log(`Post ${postId} reported by ${reporterId}: ${reason}`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report post' });
  }
});

// Add comment to post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { content } = req.body;
    
    // First, try to insert into database
    try {
      const { data: commentData, error: dbError } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          author_id: "current_user",
          author_name: "Current User",
          content: content,
          likes_count: 0
        })
        .select()
        .single();

      if (dbError) {
        console.log('Database insert failed, using mock data:', dbError.message);
        throw dbError;
      }

      // Format the response to match frontend expectations
      const formattedComment = {
        id: commentData.id,
        postId: commentData.post_id,
        author: commentData.author_name,
        authorId: commentData.author_id,
        content: commentData.content,
        timeAgo: "Just now",
        likes: commentData.likes_count,
        isLiked: false,
        replies: []
      };

      res.json(formattedComment);
      return;
    } catch (dbError) {
      console.log('Using mock data for comment creation');
    }
    
    // Fallback to mock data if database fails
    const newComment = {
      id: mockComments.length + 1,
      postId,
      author: "Current User", // In production, get from auth
      authorId: "current_user",
      content,
      timeAgo: "Just now",
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    mockComments.push(newComment);
    
    // Update post reply count
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.replies = mockComments.filter(c => c.postId === postId);
    }
    
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Update comment likes
router.post('/posts/:postId/comments/:commentId/likes', (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const { action } = req.body;
    const userId = "current_user"; // In production, get from auth
    
    const comment = mockComments.find(c => c.id === commentId && c.postId === postId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Toggle like
    if (comment.isLiked) {
      comment.likes--;
      comment.isLiked = false;
    } else {
      comment.likes++;
      comment.isLiked = true;
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment likes' });
  }
});

// Delete comment
router.delete('/posts/:postId/comments/:commentId', (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const userId = "current_user"; // In production, get from auth
    
    const comment = mockComments.find(c => c.id === commentId && c.postId === postId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    mockComments = mockComments.filter(c => c.id !== commentId);
    
    // Update post reply count
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.replies = mockComments.filter(c => c.postId === postId);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Join WhatsApp group
router.post('/posts/:id/join-whatsapp', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = "current_user"; // In production, get from auth
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.whatsappGroupJoined = true;
    
    res.json({ success: true, whatsappUrl: "https://chat.whatsapp.com/GlzOFe6jnvtKf6z0fnVoyk" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join WhatsApp group' });
  }
});

// Search posts
router.get('/search', (req, res) => {
  try {
    const { q, category, language, sortBy } = req.query;
    
    let filteredPosts = [...mockPosts];
    
    // Apply search filter
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    // Apply language filter
    if (language && language !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.language === language);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
        break;
      case 'replies':
        filteredPosts.sort((a, b) => b.replies.length - a.replies.length);
        break;
      case 'views':
        filteredPosts.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
      default:
        filteredPosts.sort((a, b) => new Date(b.timeAgo) - new Date(a.timeAgo));
        break;
    }
    
    // Add reply counts
    const postsWithReplies = filteredPosts.map(post => ({
      ...post,
      replies: mockComments.filter(comment => comment.postId === post.id)
    }));
    
    res.json(postsWithReplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

module.exports = router;
