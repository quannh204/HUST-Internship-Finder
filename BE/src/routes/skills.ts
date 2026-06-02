import { Router } from 'express';
import { Skill } from '../models/skill';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Lấy danh sách tất cả kỹ năng
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Danh sách kỹ năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const skills = await Skill.find().select('_id name').lean();
    res.status(200).json({ data: skills });
  })
);

export default router;