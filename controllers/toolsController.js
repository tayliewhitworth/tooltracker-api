const Tool = require("../model/Tool");
const asyncHandler = require("express-async-handler");

//  @desc Get tool
// @route GET /tools
// @access Private

const getAllTools = asyncHandler(async (req, res) => {
  const tools = await Tool.find().lean();
  if (!tools?.length) {
    return res.status(400).json({ message: "No tools found" });
  }

  res.json(tools);
});

//  @desc create new tool
// @route POST /tool
// @access Private

const createNewTool = asyncHandler(async (req, res) => {
  const { toolname, toolimage } = req.body;
  if (!toolname || !toolimage) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Tool.findOne({ toolname }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate tool name" });
  }

  const tool = await Tool.create({ toolname, toolimage });
  if (tool) {
    return res.status(201).json({ message: "New tool created" });
  } else {
    return res.status(400).json({ message: "Invalid tool data recieved" });
  }
});

//  @desc update tool
// @route PATCH /tools
// @access Private

const updateTool = asyncHandler(async (req, res) => {
  const { id, toolname, toolimage, checkedOut } = req.body;
  // confirm data
  if (!id || !toolname || typeof checkedOut !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  // confirm note exists
  const tool = await Tool.findById(id).exec();
  if (!tool) {
    return res.status(400).json({ message: "Tool not found" });
  }

  const duplicate = await Tool.findOne({ toolname }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate tool name" });
  }

  tool.toolname = toolname;
  tool.toolimage = toolimage;
  tool.checkedOut = checkedOut;

  const updatedTool = await tool.save();
  res.json({ message: `${updatedTool.toolname} updated` });
});

//  @desc delete  tool
// @route DELETE /tools
// @access Private

const deleteTool = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Tool ID required" });
  }

  const tool = await Tool.findById(id).exec();

  if (!tool) {
    return res.status(400).json({ message: "Tool not found" });
  }

  const result = await tool.deleteOne();
  const reply = `Tool ${result.toolname} with ID ${result.id} deleted.`;
  res.json(reply);
});

module.exports = {
  getAllTools,
  createNewTool,
  updateTool,
  deleteTool,
};
