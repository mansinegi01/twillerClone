require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("ERROR: MONGO_URI is not defined in environment variables");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");
    const commentscollection = client.db("database").collection("comments");

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });

    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email }).toArray();
      res.send(user);
    });

    app.post("/post", async (req, res) => {
      const { name, username, post, photo, video } = req.body;
      const result = await postcollection.insertOne({
        name,
        username,
        post,
        photo,
        video,
      });
      res.send(result);
    });

    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });

    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });

    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const updateDoc = { $set: req.body };
      const options = { upsert: true };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.post("/comments", async (req, res) => {
      const { postId, name, email, text } = req.body;

      const comment = {
        postId: new ObjectId(postId), // 👈 this is the fix
        name,
        email,
        text,
        timestamp: new Date(),
      };

      const result = await commentscollection.insertOne(comment);
      res.send(result);
    });

    app.get("/comments/:postId", async (req, res) => {
      const postId = req.params.postId;
      const comments = await commentscollection
        .find({ postId: new ObjectId(postId) })
        .sort({ timestamp: -1 })
        .toArray();
      res.send(comments);
    });
  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twiller backend is running");
});

app.listen(port, () => {
  console.log(`Twiller clone is running on port ${port}`);
});
