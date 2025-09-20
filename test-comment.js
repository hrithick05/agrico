// Test script to verify comment functionality
const API_BASE_URL = 'http://localhost:3001/api';

async function testCommentCreation() {
  console.log('🧪 Testing comment creation...');
  
  try {
    // Test creating a comment
    const response = await fetch(`${API_BASE_URL}/forum/posts/1/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: 'This is a test comment from the database!'
      })
    });

    if (response.ok) {
      const comment = await response.json();
      console.log('✅ Comment created successfully:', comment);
      return comment;
    } else {
      const error = await response.text();
      console.log('❌ Failed to create comment:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating comment:', error.message);
    return null;
  }
}

async function testGetPosts() {
  console.log('🧪 Testing posts retrieval...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts`);
    
    if (response.ok) {
      const posts = await response.json();
      console.log('✅ Posts retrieved successfully:', posts.length, 'posts');
      
      // Show comments for first post
      if (posts.length > 0) {
        console.log('📝 Comments for first post:', posts[0].replies.length);
        posts[0].replies.forEach((comment, index) => {
          console.log(`  ${index + 1}. ${comment.author}: ${comment.content}`);
        });
      }
      
      return posts;
    } else {
      const error = await response.text();
      console.log('❌ Failed to get posts:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error getting posts:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting comment functionality test...');
  
  // Wait a bit for servers to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test getting posts first
  await testGetPosts();
  
  // Test creating a comment
  await testCommentCreation();
  
  // Test getting posts again to see the new comment
  console.log('\n🔄 Testing posts after comment creation...');
  await testGetPosts();
  
  console.log('\n✅ Test completed!');
}

main();
