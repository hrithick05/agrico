#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AgroConnect Backend Server...');

// Start the server
const serverProcess = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit'
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
});

serverProcess.on('close', (code) => {
  console.log(`📊 Server process exited with code ${code}`);
});

// Test the server after a short delay
setTimeout(async () => {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Server is running successfully!');
      console.log('📡 Health check response:', data);
    } else {
      console.log('❌ Server health check failed');
    }
  } catch (error) {
    console.log('❌ Server is not responding:', error.message);
  }
}, 3000);

// Keep the script running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill();
  process.exit(0);
});
