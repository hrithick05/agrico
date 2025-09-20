#!/usr/bin/env node

/**
 * Development Startup Script for AgroConnect
 * Starts both frontend and backend servers
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AgroConnect Development Environment...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Start frontend server
console.log('🎨 Starting frontend server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe',
  shell: true
});

frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Wait for servers to start
setTimeout(() => {
  console.log('\n✅ Development servers started!');
  console.log('🌐 Frontend: http://localhost:5173');
  console.log('📡 Backend: http://localhost:3001');
  console.log('🔍 Health Check: http://localhost:3001/health');
  console.log('\nPress Ctrl+C to stop both servers\n');
}, 3000);
