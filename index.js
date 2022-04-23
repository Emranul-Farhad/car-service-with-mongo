const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors');
// const { clearCookie } = require('express/lib/response');
require('dotenv').config()



app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_pass}@cluster0.ieyiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    
   try{
       await client.connect()
       const collection = client.db("Carsite").collection("services");

       app.get('/services', async(req,res)=> {
         const query = {}
         const cursor = collection.find(query)
         const result = await cursor.toArray()
         res.send(result)
       })

       app.get('/services/:id' , async(req,res)=> {
         const id = req.params.id;
         const query = {_id: ObjectId(id)}
         const singelid = await collection.findOne(query)
         res.send(singelid) 
       })
      
        app.post('/services' , async(req,res)=>{
          const query = req.body
          const result = await collection.insertOne(query)
          res.send(result)
        })

        app.delete('/services?:id' ,async(req,res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const deleted = await collection.deleteOne(query)
          res.send(deleted)
        } )

   }

    finally{

    }

}

run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("connected");
//   // perform actions on the collection object
//   client.close();
// });



app.get('/', (req, res) => {
  res.send('Hello Worlda!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})