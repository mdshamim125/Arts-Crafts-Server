const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://cse12005038brur:j3okhLObb3jLTwlX@cluster0.s1le0vj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftItemCollection = client.db("Art-Craft").collection("craftItem");

    app.post("/craft", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await craftItemCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/craft", async (req, res) => {
      const cursor = craftItemCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftItemCollection.findOne(query);
      res.send(result);
    });

    app.get("/myCraft/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await craftItemCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/myCraft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;

      const craft = {
        $set: {
          image: updatedCraft.image,
          itemName: updatedCraft.itemName,
          subcategoryName: updatedCraft.subcategoryName,
          shortDescription: updatedCraft.shortDescription,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processingTime: updatedCraft.processingTime,
          stockStatus: updatedCraft.stockStatus,
        },
      };

      const result = await craftItemCollection.updateOne(filter, craft, options);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/myCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftItemCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Art & Craft Server is running.....");
});

app.listen(port, () => {
  console.log(`Art & Craft Server is running on port: ${port}`);
});
