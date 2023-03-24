const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  toolname: {
    type: String,
    required: true,
  },
  toolimage: {
    type: String,
    required: true,
    default:
      "https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  checkedOut: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Tool", toolSchema);
