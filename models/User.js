const { Schema, model } = require("mongoose");
const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "username is required!",
      trimmed: true,
    },
    email: {
      type: String,
      required: "Email is required!",
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Enter a valid email address",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  opts
);

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
