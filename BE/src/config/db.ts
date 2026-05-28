import mongoose from 'mongoose';

export const connectToDatabase = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
};
