const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: 'https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    text: {
      type: String,
      required: true,
    },
    checkedOut: {
      type: Boolean,
      default: true,
    },
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
    },
  },
  {
    timestamps: true,
  }
);

// This was causing my issue
// noteSchema.plugin(AutoIncrement, {
//   inc_field: "ticket",
//   id: "ticketNums",
//   start_seq: 500,
// });

module.exports = mongoose.model("Note", noteSchema);
