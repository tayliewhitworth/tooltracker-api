const express = require("express");
const router = express.Router();
const toolsController = require("../controllers/toolsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(toolsController.getAllTools)
  .post(toolsController.createNewTool)
  .patch(toolsController.updateTool)
  .delete(toolsController.deleteTool);

module.exports = router;
