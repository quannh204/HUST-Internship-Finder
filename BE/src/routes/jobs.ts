import { Router } from 'express';
import { getJobById, listJobs, searchJobs } from '../controllers/jobController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Hiển thị danh sách công việc
 *     tags: [Jobs]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Lọc theo vị trí/chức danh công việc
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Danh sách skill id hoặc tên skill, phân tách bằng dấu phẩy
 *       - in: query
 *         name: majors
 *         schema:
 *           type: string
 *         description: Danh sách major id hoặc tên major, phân tách bằng dấu phẩy
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
 *         description: Danh sách công việc có phân trang
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
 *     summary: Tìm kiếm công việc
 *     tags: [Jobs]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm trong title, companyName, description
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
 *         description: Kết quả tìm kiếm có phân trang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedJobsResponse'
 *       400:
 *         description: Thiếu query q
 */
router.get('/search', asyncHandler(searchJobs));

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Hiển thị chi tiết công việc
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của công việc
 *     responses:
 *       200:
 *         description: Chi tiết công việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Job id không hợp lệ
 *       404:
 *         description: Không tìm thấy công việc
 */
router.get('/:id', asyncHandler(getJobById));

export default router;
