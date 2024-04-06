import fs from 'fs';

function writeDotEnv() {
  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  const USER = 'root';
  const PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
  const PORT = process.env.MYSQL_PORT;
  const DATABASE = process.env.MYSQL_DATABASE;

  // Database connection string for Prisma
  const content = `DATABASE_URL="mysql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE}"`;

  // Write the .env file
  try {
    fs.writeFileSync('.env', content);
    console.log('`backend/.env` file created successfully!');
  } catch (error) {
    console.error('Error writing .env file:', error);
    process.exit(1);
  }
}

export default writeDotEnv;
