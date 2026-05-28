import { FilterQuery, Types } from 'mongoose';
import { Request, Response } from 'express';
import { Job, JobDocument } from '../models/job';
import { Major } from '../models/major';
import { Skill } from '../models/skill';
import { buildPaginationMeta, getPagination } from '../utils/pagination';

const parseCsv = (value: unknown) => {
  if (!value || typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const createRegex = (value: string) =>
  new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

const resolveReferenceIds = async (value: unknown, model: Pick<typeof Skill, 'find'>) => {
  const values = parseCsv(value);

  if (values.length === 0) {
    return { provided: false, ids: [] };
  }

  const objectIds = values.filter((item) => Types.ObjectId.isValid(item));
  const names = values.filter((item) => !Types.ObjectId.isValid(item));
  const nameMatches =
    names.length > 0
      ? await model
          .find({ name: { $in: names.map(createRegex) } })
          .select('_id')
          .lean()
      : [];

  return { provided: true, ids: [...objectIds, ...nameMatches.map((skill) => skill._id)] };
};

const buildJobFilter = async (req: Request): Promise<FilterQuery<JobDocument>> => {
  const filter: FilterQuery<JobDocument> = {};
  const {
    position,
    foreignLanguageAbility,
    location,
    workType,
    experience,
    fresherAccepted,
    jobType,
    status,
  } = req.query;
  const [skillFilter, majorFilter] = await Promise.all([
    resolveReferenceIds(req.query.skills, Skill),
    resolveReferenceIds(req.query.majors, Major),
  ]);

  if (typeof position === 'string' && position.trim()) {
    filter.title = createRegex(position.trim());
  }

  if (skillFilter.provided) {
    filter.skills = { $in: skillFilter.ids };
  }

  if (majorFilter.provided) {
    filter.majors = { $in: majorFilter.ids };
  }

  if (typeof foreignLanguageAbility === 'string' && foreignLanguageAbility.trim()) {
    filter.foreignLanguageAbility = createRegex(foreignLanguageAbility.trim());
  }

  if (typeof location === 'string' && location.trim()) {
    filter.location = createRegex(location.trim());
  }

  if (typeof workType === 'string' && workType.trim()) {
    filter.workType = workType.trim().toUpperCase();
  }

  if (typeof experience === 'string' && experience.trim()) {
    filter.experience = createRegex(experience.trim());
  }

  if (typeof fresherAccepted === 'string' && fresherAccepted.trim()) {
    filter.fresherAccepted = fresherAccepted === 'true';
  }

  if (typeof jobType === 'string' && jobType.trim()) {
    filter.jobType = jobType.trim().toUpperCase();
  }

  if (typeof status === 'string' && status.trim()) {
    filter.status = status.trim().toUpperCase();
  } else {
    filter.status = 'ACTIVE';
  }

  return filter;
};

const runPaginatedJobQuery = async (
  req: Request,
  filter: FilterQuery<JobDocument>,
  sort: Record<string, 1 | -1 | { $meta: 'textScore' }> = { createdAt: -1 },
) => {
  const { page, limit, skip } = getPagination(req);
  const [jobs, totalItems] = await Promise.all([
    Job.find(filter)
      .populate('skills', 'name')
      .populate('majors', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  return {
    data: jobs,
    pagination: buildPaginationMeta(totalItems, page, limit),
  };
};

export const listJobs = async (req: Request, res: Response) => {
  const filter = await buildJobFilter(req);
  const result = await runPaginatedJobQuery(req, filter);

  res.status(200).json(result);
};

export const searchJobs = async (req: Request, res: Response) => {
  const keyword = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!keyword) {
    res.status(400).json({ message: 'Query parameter q is required' });
    return;
  }

  const filter = await buildJobFilter(req);
  const searchFilter: FilterQuery<JobDocument> = {
    ...filter,
    $text: { $search: keyword },
  };
  const result = await runPaginatedJobQuery(req, searchFilter, {
    score: { $meta: 'textScore' },
    createdAt: -1,
  });

  res.status(200).json(result);
};

export const getJobById = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Invalid job id' });
    return;
  }

  const job = await Job.findById(req.params.id)
    .populate('skills', 'name')
    .populate('majors', 'name')
    .lean();

  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }

  res.status(200).json({ data: job });
};
