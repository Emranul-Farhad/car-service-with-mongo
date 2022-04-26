const express = require('express')
const app = express()
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors');
// const { clearCookie } = require('express/lib/response');
require('dotenv').config()



app.use(cors())
app.use(express.json())
// 


function jwtTokens (req,res,next) {
  const authHeader = req.headers.authorization
  if(!authHeader){
    return res.status(401).send({ Message: "unauthorized access"})
  }
  const token = authHeader.split(' ')[1]
  console.log(token);
  jwt.verify( token, process.env.ACCESS_TOKEN_JWTS, (err, decoded) => {

    if(err){
      return res.status(403).send({Message: "forbiden user"})
    }
    req.decoded = decoded
    console.log('decode', decoded);
    next()

  })
 
}


// function JwtTokers(req,res,next){
//   const authHeader = req.headers.authorization
//   console.log( "from outta" ,  authHeader);
//   next()
// }




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_pass}@cluster0.ieyiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    
   try{
       await client.connect()
       const collection = client.db("Carsite").collection("services");
       const orderCollection = client.db("orders").collection("orderServices");


      //  JWT ACCESS token create jwt token

      app.post('/login' , async(req,res)=> {
        const user = req.body;
        const jwtAccess =  jwt.sign(user, process.env.ACCESS_TOKEN_JWTS ,{
          expiresIn : '1d'
        } )
        res.send({jwtAccess})
      })

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


        // order get from client side

        app.post('/orders',  async(req,res)=> {
          const orders = req.body;
          const result = await orderCollection.insertOne(orders)
          res.send(result);
        })

        app.get('/orders', jwtTokens, async(req,res)=> { 
          const email = req.query.email;
          const decoder = req.decoded.Email;
          if(email === decoder){
            const query = { userEmail : email }
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
          }
          else{
            res.status(403).send({Message: "forbiden user"})
          }
           
 
        
        
        })

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