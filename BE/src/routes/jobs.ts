import { Router } from 'express';
import { getJobById, listJobs, searchJobs } from '../controllers/jobController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Hien thi danh sach cong viec
 *     tags: [Jobs]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Loc theo vi tri/chuc danh cong viec
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Danh sach skill id hoac ten skill, phan tach bang dau phay
 *       - in: query
 *         name: majors
 *         schema:
 *           type: string
 *         description: Danh sach major id hoac ten major, phan tach bang dau phay
 *       - in: query
 *         name: foreignLanguageAbility
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: workType
 *         schema:
 *           type: string
 *           enum: [OFFLINE, REMOTE, HYBRID]
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *       - in: query
 *         name: fresherAccepted
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [PART_TIME, FULL_TIME]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, EXPIRED, DRAFT]
 *     responses:
 *       200:
 *         description: Danh sach cong viec co phan trang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedJobsResponse'
 */
router.get('/', asyncHandler(listJobs));

/**
 * @swagger
 * /api/jobs/search:
 *   get:
 *     summary: Tim kiem cong viec
 *     tags: [Jobs]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Tu khoa tim kiem trong title, companyName, description
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: workType
 *         schema:
 *           type: string
 *           enum: [OFFLINE, REMOTE, HYBRID]
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *       - in: query
 *         name: majors
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ket qua tim kiem co phan trang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedJobsResponse'
 *       400:
 *         description: Thieu query q
 */
router.get('/search', asyncHandler(searchJobs));

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Hien thi chi tiet cong viec
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId cua cong viec
 *     responses:
 *       200:
 *         description: Chi tiet cong viec
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Job id khong hop le
 *       404:
 *         description: Khong tim thay cong viec
 */
router.get('/:id', asyncHandler(getJobById));

export default router;
