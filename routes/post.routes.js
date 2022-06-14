const router = require("express").Router();
const postController = require("../controllers/post.controller");
// Post
router.post("/", postController.createPost);
router.get("/:id", postController.getPost);
router.put("/:id", postController.updatePost);
router.put("/:id/like", postController.likePost);
router.delete("/:id", postController.deletePost);
router.get("/timeline/all", postController.getTimeline);

module.exports = router;
