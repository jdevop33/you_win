import { Storage } from '@google-cloud/storage';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env
config({ path: resolve(__dirname, '../.env') });

const requiredEnvVars = {
  GCP: ['GCP_PROJECT_ID', 'GCP_STORAGE_BUCKET', 'GCP_CREDENTIALS'],
  CLERK: ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'],
  DATABASE: ['DATABASE_URL']
} as const;

async function validateEnv() {
  let hasErrors = false;

  // Check for required variables
  Object.entries(requiredEnvVars).forEach(([service, vars]) => {
    console.log(`\nChecking ${service} configuration...`);
    vars.forEach(varName => {
      if (!process.env[varName]) {
        console.error(`❌ Missing ${varName}`);
        hasErrors = true;
      } else {
        console.log(`✅ Found ${varName}`);
      }
    });
  });

  // Test GCP Storage connection
  if (!hasErrors) {
    try {
      const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: JSON.parse(process.env.GCP_CREDENTIALS!)
      });
      
      const [exists] = await storage
        .bucket(process.env.GCP_STORAGE_BUCKET!)
        .exists();
      
      if (!exists) {
        console.error(`\n❌ Bucket ${process.env.GCP_STORAGE_BUCKET} does not exist`);
        hasErrors = true;
      } else {
        console.log('\n✅ GCP Storage connection successful');
      }
    } catch (error) {
      console.error('\n❌ GCP Storage connection failed:', error instanceof Error ? error.message : String(error));
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

validateEnv().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
}); 