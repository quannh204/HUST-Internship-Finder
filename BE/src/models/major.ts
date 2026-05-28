import mongoose, { InferSchemaType } from 'mongoose';

const majorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export type MajorDocument = InferSchemaType<typeof majorSchema>;

export const Major = mongoose.model('Major', majorSchema);
