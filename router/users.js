const express = require("express"),
  router = express.Router(),
  User = require("../models/User");

router.get("/", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => console.log(err));
});

router.get("/user/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user);
    })
    .catch(err => console.log(err));
});

router.get("/followedusers/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user);
    })
    .catch(err => console.log(err));
});

router.post("/update", (req, res) => {
  const { id, name } = req.body;
  User.findByIdAndUpdate(id, { $set: { name } }, { new: true }).then(user =>
    res.json(user)
  );
});

router.post("/delete/:id/", (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id).then(user => res.json(user));
});

router.post("/follow/:currid/:id", (req, res) => {
  const { id, currid } = req.params;
  User.findById(id)
    .then(user => {
      if (user.followers.includes(currid)) {
      } else {
        User.findByIdAndUpdate(
          id,
          { $addToSet: { followers: currid } },
          { new: true }
        ).catch(err => console.log(err));
        User.findByIdAndUpdate(currid, { $addToSet: { followedusers: id } })
          .then(() =>
            res.json({
              follow: {
                follower: currid,
                followeduser: id
              }
            })
          )
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

router.post("/unfollow/:currid/:id", (req, res) => {
  const { id, currid } = req.params;
  User.findById(id)
    .then(user => {
      if (user.followers.includes(currid)) {
        User.findByIdAndUpdate(id, { $pull: { followers: currid } }).catch(
          err => console.log(err)
        );
        User.findByIdAndUpdate(currid, { $pull: { followedusers: id } })
          .then(() =>
            res.json({
              unfollow: {
                follower: currid,
                followeduser: id
              }
            })
          )
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
