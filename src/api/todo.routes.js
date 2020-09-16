const { Router } = require("express");

const Todo = require("../models/Todo");
const {schemaValidator} = require("../middlewares/index")

const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (error) {
    res.status(500);
    next(error);
  }
});

router.post("/", schemaValidator, async (req, res, next) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).json({ message: "Created", todo });
  } catch (error) {
    if (error.code === 11000) {
      res.status(206);
      error.message = 'Duplicate todo added';
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }

    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/toggle/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
  
    res.status(200).json({ message: "Switched" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
