const mongoose = require("mongoose");
const Conservation = new mongoose.Schema({
  members: {
    type: Array,
    required: true,
      },
});
const conservation = mongoose.model("conservation", Conservation);
module.exports = conservation;
