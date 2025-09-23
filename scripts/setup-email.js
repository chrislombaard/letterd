#!/usr/bin/env node
/**
 * Setup script for configuring email service
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('🚀 Newsletter Email Service Setup\n');
  
  console.log('This script will help you configure your email service using Resend.\n');
  console.log('Steps to get started:');
  console.log('1. Sign up at https://resend.com (free tier: 3,000 emails/month)');
  console.log('2. Add your domain and set up DNS records (DKIM, SPF, DMARC)');
  console.log('3. Use a subdomain like send.notifications.yourdomain.com');
  console.log('4. Get your API key from the dashboard\n');
  console.log('💡 For newsletters, use: noreply@notifications.yourdomain.com\n');

  const apiKey = await question('Enter your Resend API key: ');
  const fromEmail = await question('Enter your "from" email address (e.g., noreply@notifications.yourdomain.com): ');
  const cronSecret = await question('Enter a secret key for cron security (or press Enter for auto-generated): ') 
    || Math.random().toString(36).substring(2, 15);

  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  const updateEnvVar = (key, value) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const line = `${key}=${value}`;
    
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, line);
    } else {
      envContent += `\n${line}`;
    }
  };

  updateEnvVar('RESEND_API_KEY', apiKey);
  updateEnvVar('FROM_EMAIL', fromEmail);
  updateEnvVar('CRON_SECRET', cronSecret);

  fs.writeFileSync(envPath, envContent.trim() + '\n');

  console.log('\n✅ Email service configured successfully!');
  console.log(`📧 From email: ${fromEmail}`);
  console.log(`🔐 Cron secret: ${cronSecret}`);
  console.log('\nNext steps:');
  console.log('1. Test your configuration by creating a post and subscriber');
  console.log('2. Schedule a post and trigger the cron job');
  console.log('3. Check your email for the newsletter!\n');
  
  rl.close();
}

setup().catch(console.error);