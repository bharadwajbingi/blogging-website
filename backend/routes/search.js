import express from 'express';
import {
  searchPosts,
  getTags,
  getPostsByTag
} from '../controllers/searchController.js';

const router = express.Router();

router.get('/posts', searchPosts);
router.get('/tags', getTags);
router.get('/tags/:tag', getPostsByTag);

export default router;