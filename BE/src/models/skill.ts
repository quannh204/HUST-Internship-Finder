import mongoose, { InferSchemaType } from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export type SkillDocument = InferSchemaType<typeof skillSchema>;

export const Skill = mongoose.model('Skill', skillSchema);
