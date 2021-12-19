const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");
const getters = { toJSON: { getters: true, virtuals: true } };
const reaction = require("./Reaction");

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => dateFormat(createdAt),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reaction],
  },
  getters
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
