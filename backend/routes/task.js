const router = require("express").Router();
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

// Middleware
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).send("Invalid Token");
  }
}

// Add Task
router.post("/", auth, async (req, res) => {
  const task = new Task({
    userId: req.user.id,
    title: req.body.title
  });
  await task.save();
  res.json(task);
});

// Get Tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// ✅ Update Task (FIXED)
router.put("/:id", auth, async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: completed },
    { returnDocument: "after" } // ✅ new syntax
    );

    res.json(task);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Update error ❌" });
  }
});

// Delete Task
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;