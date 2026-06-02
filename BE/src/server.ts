import 'dotenv/config';
import app from './app';
import { connectToDatabase } from './config/db';
import { Job } from './models/job'; 

const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is required');
}

const migrateJobs = async () => {
  try {
    const jobs = await Job.find({ normalizedLocation: { $exists: false } });
    if (jobs.length === 0) {
      console.log('✅ All jobs already have normalizedLocation');
      return;
    }

    for (const job of jobs) {
      job.normalizedLocation = job.location
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      await job.save();
    }
    console.log(`✅ Migrated ${jobs.length} jobs`);
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
};

const startServer = async () => {
  await connectToDatabase(mongoUri);
  
  await migrateJobs(); 

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger API docs: http://localhost:${port}/api-docs`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});