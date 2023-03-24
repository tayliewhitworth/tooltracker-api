const User = require("../model/User");
const Note = require("../model/Note");
const Tool = require("../model/Tool");
const asyncHandler = require("express-async-handler");

//  @desc Get note
// @route GET /notes
// @access Private

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }
  // add a username to each note before sending response
  // using map to loop over users and notes
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      const tool = await Tool.findById(note.tool).lean().exec();
      if (tool) {
        return {
          ...note,
          username: user.username,
          toolname: tool.toolname,
        };
      } else {
        return { ...note, username: user.username };
      }
    })
  );

  res.json(notesWithUser);
});

//  @desc create new note
// @route POST /users
// @access Private

const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text, tool, image } = req.body;
  if (!user || !title || !text || !tool || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  const note = await Note.create({
    user,
    title,
    text,
    tool,
    image,
  });
  if (note) {
    const toolToCheckOut = await Tool.findById(tool).exec();
    toolToCheckOut.checkedOut = true;
    await toolToCheckOut.save();
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data recieved" });
  }
});

//  @desc update note
// @route PATCH /users
// @access Private

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, checkedOut, tool, image } = req.body;
  // confirm data
  if (
    !id ||
    !user ||
    !title ||
    !image ||
    !text ||
    typeof checkedOut !== "boolean" ||
    !tool
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // confirm note exists
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  const toolToUpdate = await Tool.findById(tool).exec();
  if (!toolToUpdate) {
    return res.status(404).json({ message: "Tool not found" });
  }

  if (checkedOut !== toolToUpdate.checkedOut) {
    toolToUpdate.checkedOut = checkedOut;
    await toolToUpdate.save();
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.checkedOut = checkedOut;
  note.tool = tool;
  note.image = image;

  const updatedNote = await note.save();
  res.json({ message: `${updatedNote.title} updated` });
});

//  @desc delete  note
// @route DELETE /users
// @access Private

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  const result = await note.deleteOne();
  const reply = `Note ${result.title} with ID ${result.id} deleted.`;
  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
