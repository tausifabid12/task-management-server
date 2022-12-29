const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is up");
});

console.log(process.env.USER_NAME, process.env.PASSWORD);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.brxmqep.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
}

dbConnect();

//**** collections
const TaskInfo = client.db("Task-Management-System").collection("TaskInfo");

//*** apis

// task apis

app.get("/allTasks", async (req, res) => {
  try {
    const email = req.query.email;
    const filter = { email: email };

    const allTasks = await TaskInfo.find(filter).toArray();
    res.send({
      status: true,
      data: allTasks,
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});

app.put("/updateTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateInfo = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: updateInfo,
    };
    const result = await TaskInfo.updateOne(filter, updateDoc, options);
    res.send({
      status: true,
      data: result,
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});

app.post("/addTask", async (req, res) => {
  try {
    const taskInfo = req.body;
    const result = await TaskInfo.insertOne(taskInfo);
    res.send({
      status: true,
      data: result,
      message: "Task added",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: ObjectId(id) };

    const result = await TaskInfo.deleteOne(filter);
    res.send({
      status: true,
      data: result,
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      data: [],
      message: "",
    });
  }
});

app.listen(port, () => {
  console.log("server is running");
});
