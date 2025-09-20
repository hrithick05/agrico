#!/usr/bin/env node

/**
 * Forum Database Setup Script for AgroConnect
 * Creates forum tables for posts and comments
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createForumTables() {
  console.log('🏗️ Creating forum tables...');
  
  const createTablesSQL = `
    -- Create forum_posts table
    CREATE TABLE IF NOT EXISTS forum_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      author_id VARCHAR(100) NOT NULL,
      author_name VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      language VARCHAR(50) NOT NULL DEFAULT 'English',
      has_voice_note BOOLEAN DEFAULT FALSE,
      images JSONB DEFAULT '[]',
      tags JSONB DEFAULT '[]',
      likes_count INTEGER DEFAULT 0,
      dislikes_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      author_reputation INTEGER DEFAULT 100,
      is_verified BOOLEAN DEFAULT FALSE,
      whatsapp_group_joined BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create forum_comments table
    CREATE TABLE IF NOT EXISTS forum_comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
      author_id VARCHAR(100) NOT NULL,
      author_name VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      parent_comment_id INTEGER REFERENCES forum_comments(id) ON DELETE CASCADE,
      likes_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create post_likes table
    CREATE TABLE IF NOT EXISTS post_likes (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
      user_id VARCHAR(100) NOT NULL,
      action VARCHAR(10) NOT NULL CHECK (action IN ('like', 'dislike')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(post_id, user_id)
    );

    -- Create comment_likes table
    CREATE TABLE IF NOT EXISTS comment_likes (
      id SERIAL PRIMARY KEY,
      comment_id INTEGER REFERENCES forum_comments(id) ON DELETE CASCADE,
      user_id VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(comment_id, user_id)
    );

    -- Create post_bookmarks table
    CREATE TABLE IF NOT EXISTS post_bookmarks (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
      user_id VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(post_id, user_id)
    );

    -- Create reports table
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
      reporter_id VARCHAR(100) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (error) {
      console.log('❌ Error creating tables:', error.message);
      return false;
    } else {
      console.log('✅ Forum tables created successfully!');
      return true;
    }
  } catch (err) {
    console.log('❌ Error creating tables:', err.message);
    return false;
  }
}

async function insertSampleForumData() {
  console.log('📊 Inserting sample forum data...');
  
  const samplePosts = [
    {
      title: "Best practices for wheat crop in March",
      content: "I've been farming wheat for 10 years and wanted to share some insights about planting in March conditions. The key is to ensure proper soil preparation and timing.",
      author_id: "user1",
      author_name: "Ramesh Kumar",
      category: "Crop Management",
      language: "Hindi",
      has_voice_note: true,
      images: ["wheat-field.jpg"],
      tags: ["wheat", "planting", "march"],
      likes_count: 24,
      dislikes_count: 2,
      views_count: 156,
      author_reputation: 1250,
      is_verified: true,
      whatsapp_group_joined: false
    },
    {
      title: "Dealing with aphid infestation on cotton",
      content: "My cotton crop is showing signs of aphid damage. Has anyone tried organic solutions that actually work? I'm looking for natural alternatives to chemical pesticides.",
      author_id: "user2",
      author_name: "Priya Patel",
      category: "Pest Control",
      language: "English",
      has_voice_note: false,
      images: ["cotton-aphids.jpg"],
      tags: ["cotton", "aphids", "organic", "pestcontrol"],
      likes_count: 16,
      dislikes_count: 1,
      views_count: 89,
      author_reputation: 890,
      is_verified: false,
      whatsapp_group_joined: true
    }
  ];

  const sampleComments = [
    {
      post_id: 1,
      author_id: "user5",
      author_name: "Suresh Kumar",
      content: "Great insights! I've been following similar practices for wheat cultivation. The timing you mentioned is crucial for good yield.",
      likes_count: 5
    },
    {
      post_id: 1,
      author_id: "user6",
      author_name: "Priya Singh",
      content: "Thank you for sharing. This is very helpful. I'm planning to plant wheat next month and this timing advice is perfect.",
      likes_count: 3
    },
    {
      post_id: 2,
      author_id: "user8",
      author_name: "Rajesh Kumar",
      content: "Try neem oil spray, it works well for aphids. Mix 2ml neem oil with 1 liter water and spray every 3 days.",
      likes_count: 8
    }
  ];

  try {
    // Insert posts
    const { error: postsError } = await supabase.from('forum_posts').insert(samplePosts);
    if (postsError) {
      console.error('❌ Error inserting posts:', postsError.message);
    } else {
      console.log('✅ Inserted sample posts successfully!');
    }

    // Insert comments
    const { error: commentsError } = await supabase.from('forum_comments').insert(sampleComments);
    if (commentsError) {
      console.error('❌ Error inserting comments:', commentsError.message);
    } else {
      console.log('✅ Inserted sample comments successfully!');
    }

  } catch (err) {
    console.error('❌ Error inserting sample data:', err.message);
  }
}

async function testForumTables() {
  console.log('🔍 Testing forum tables...');
  
  try {
    // Test posts table
    const { data: posts, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.log('❌ Posts table test failed:', postsError.message);
      return false;
    }

    // Test comments table
    const { data: comments, error: commentsError } = await supabase
      .from('forum_comments')
      .select('*')
      .limit(1);
    
    if (commentsError) {
      console.log('❌ Comments table test failed:', commentsError.message);
      return false;
    }

    console.log('✅ Forum tables are working correctly!');
    console.log('📊 Found', posts.length, 'posts and', comments.length, 'comments');
    return true;
  } catch (err) {
    console.log('❌ Forum tables test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Forum Database Setup...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  // Create tables
  const created = await createForumTables();
  
  if (created) {
    // Test tables
    const tested = await testForumTables();
    
    if (tested) {
      console.log('📊 Inserting sample data...');
      await insertSampleForumData();
      console.log('✅ Forum database setup complete!');
    }
  } else {
    console.log('❌ Could not create forum tables');
    console.log('📝 Please create the tables manually in Supabase SQL Editor');
  }
}

main();
