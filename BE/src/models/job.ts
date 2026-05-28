import mongoose, { InferSchemaType } from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ['PART_TIME', 'FULL_TIME'],
      required: true,
    },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    majors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Major' }],
    foreignLanguageAbility: { type: String, default: '' },
    location: { type: String, required: true },
    workType: {
      type: String,
      enum: ['OFFLINE', 'REMOTE', 'HYBRID'],
      required: true,
    },
    experience: { type: String, default: '' },
    fresherAccepted: { type: Boolean, default: false },
    salary: { type: String, default: 'Thỏa thuận' },
    deadline: { type: Date, required: true },
    sourceLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'DRAFT'],
      default: 'ACTIVE',
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

jobSchema.index({ title: 'text', companyName: 'text', description: 'text' });

export type JobDocument = InferSchemaType<typeof jobSchema>;

export const Job = mongoose.model('Job', jobSchema);
