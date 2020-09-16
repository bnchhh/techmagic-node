const mongoose = require("mongoose");
const Todo = require("../src/models/Todo");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const should = chai.should();

chai.use(chaiHttp);

describe("Todos", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Todo.deleteMany({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("/GET todo", () => {
    it("it should GET all the todos", (done) => {
      chai
        .request(server)
        .get("/todos")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  /*
   * Test the /POST route
   */
  describe("/POST route", () => {
    it("it should not POST a todo without name", (done) => {
      let todo = {
        description: "I'm nobody",
        completed: true,
      };
      chai
        .request(server)
        .post("/todos")
        .send(todo)
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.be.eql('"name" is required');
          done();
        });
    });
  });

  it("it should POST a todo ", (done) => {
    let todo = {
      name: "I'm invisible",
      description: "I'm testing material and no one will see me",
      completed: false,
    };

    chai
      .request(server)
      .post("/todos")
      .send(todo)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Created");
        res.body.should.have.property("todo");
        res.body.todo.should.have.property("name");
        res.body.todo.should.have.property("description");
        res.body.todo.should.have.property("completed");
        res.body.todo.should.have.property("_id");
        done();
      });
  });

  it("it should not POST a todo with duplicate name", (done) => {
    let todo = {
      name: "I'm invisible",
      description: "I'm second testing material and no one will see me",
      completed: true,
    };
    const originalTodo = new Todo(todo);
    originalTodo.save((err, returnedTodo) => {
      chai
        .request(server)
        .post("/todos")
        .send(todo)
        .end((err, res) => {
          res.should.have.status(206);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Duplicate todo added");

          done();
        });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id todo", () => {
    it("it should DELETE a todo given the id", (done) => {
      let todo = new Todo({
        name: "I'm invisible",
        description: "I'm testing material",
        completed: false,
      });

      todo.save((err, todo) => {
        chai
          .request(server)
          .delete("/todos/" + todo.id)
          .end((err, res) => {
            res.should.have.status(204);
            done();
          });
      });
    });
  });
  describe("/PUT/:id todo", () => {
    it("it should TOGGLE a todo status given the id", (done) => {
      let todo = new Todo({
        name: "I'm invisible",
        description: "I'm testing material",
        completed: false,
      });
      todo.save((err, todo) => {
        chai
          .request(server)
          .put("/todos/toggle/" + todo.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Switched");
            done();
          });
      });
    });
  });
});
