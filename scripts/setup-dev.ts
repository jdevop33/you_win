import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const requiredTools = [
  { name: 'node', command: 'node --version' },
  { name: 'npm', command: 'npm --version' },
  { name: 'docker', command: 'docker --version' },
  { name: 'docker-compose', command: 'docker-compose --version' },
  { name: 'git', command: 'git --version' }
];

async function main() {
  console.log('🚀 Setting up development environment...\n');

  // Check required tools
  console.log('Checking required tools...');
  for (const tool of requiredTools) {
    try {
      execSync(tool.command);
      console.log(`✅ ${tool.name} installed`);
    } catch {
      console.error(`❌ ${tool.name} not found. Please install it first.`);
      process.exit(1);
    }
  }

  // Setup local services with Docker
  console.log('\nStarting local services...');
  execSync('docker-compose -f compose.dev.yml up -d', { stdio: 'inherit' });

  // Initialize database
  console.log('\nInitializing database...');
  execSync('npx prisma migrate dev', { stdio: 'inherit' });

  console.log('\n✨ Development environment ready!');
  console.log('\nNext steps:');
  console.log('1. Run npm run dev to start the development server');
  console.log('2. Visit http://localhost:3000 to see your app');
  console.log('\nOptional: Set up external services:');
  console.log('- Clerk (Authentication): https://clerk.com');
  console.log('- GCP Storage: https://console.cloud.google.com');
  console.log('- Mailgun: https://mailgun.com');
  console.log('- OpenAI: https://platform.openai.com');
}

main().catch(console.error); 