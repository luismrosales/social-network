const router = require("express").Router();
const { User } = require("../../models");

router.get("/", (req, res) => {
  User.find({})
    .then((dbusers) => res.json(dbusers))
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/:id", ({ params }, res) => {
  User.findOne({ _id: params.id })
    .populate("thoughts")
    .populate("friends")
    .select("-__v")
    .sort({ _id: -1 })
    .then((dbuser) => res.json(dbuser))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/", ({ body }, res) => {
  User.create(body)
    .then((dbuser) => res.json(dbuser))
    .catch((error) => res.json(error));
});

router.put("/:id", ({ params, body }, res) => {
  User.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then((dbuser) => {
      if (!dbuser) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      res.json(dbuser);
    })
    .catch((err) => res.status(500).json(err));
});

router.delete("/:id", ({ params }, res) => {
  User.findOneAndDelete({ _id: params.id })
    .then((dbuser) => {
      if (!dbuser) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      res.json(dbuser);
    })
    .catch((err) => res.status(500).json(err));
});

router.post("/:userId/friends/:friendId", ({ params }, res) => {
  User.findOneAndUpdate(
    { _id: params.userId },
    { $push: { friends: params.friendId } },
    { new: true }
  )
    .then((dbuser) => {
      if (!dbuser) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      res.json(dbuser);
    })
    .catch((err) => res.status(500).json(err));
});

router.delete("/:userId/friends/:friendId", ({ params }, res) => {
  User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId } },
    { new: true }
  )
    .then((dbuser) => {
      if (!dbuser) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      res.json(dbuser);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
