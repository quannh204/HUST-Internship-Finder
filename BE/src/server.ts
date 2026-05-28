import 'dotenv/config';
import app from './app';
import { connectToDatabase } from './config/db';

const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is required');
}

const startServer = async () => {
  await connectToDatabase(mongoUri);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger API docs: http://localhost:${port}/api-docs`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
