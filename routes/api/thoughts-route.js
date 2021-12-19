const router = require("express").Router();
const { process_params } = require("express/lib/router");
const { Thought, User } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.id });
    res.json(thought);
  } catch (error) {
    res.json(error);
  }
});

router.post("/", async ({ body }, res) => {
  try {
    const thought = await Thought.create(body);
    await User.findOneAndUpdate(
      { username: body.username },
      { $push: { thoughts: thought._id } }
    );
    res.json("Thought added");
  } catch (error) {
    res.json(error);
  }
});

router.put("/:id", async ({ params, body }, res) => {
  try {
    await Thought.findOneAndUpdate({ _id: params.id }, body);
    res.json("thought updated");
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:id", async ({ params }, res) => {
  try {
    await Thought.findOneAndDelete({ _id: params.id });
    await User.findOneAndUpdate(
      { thoughts: params.id },
      { $pull: { thoughts: params.id } }
    );
    res.status(204).json();
  } catch (error) {
    res.json(error);
  }
});

router.post("/:thoughtId/reactions", async ({ params, body }, res) => {
  try {
    await Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } }
    );
    res.json("reaction created");
  } catch (error) {}
  res.json(error);
});

router.delete("/:thoughtId/reactions", async ({ params }, res) => {
  try {
    await Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: params.reactions } }
    );
    res.json("reaction removed");
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
