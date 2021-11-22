var mongodb = require('mongodb')
var mongoDbQueue = require('mongodb-queue')
const express = require('express')
const app = express()
app.use(express.json());
const port = 3000
const url = 'mongodb://localhost:27017/' 
var queue = null;
const client = new mongodb.MongoClient(url, { useNewUrlParser: true })
const db = client.db('test')
client.connect(()=>{
    queue =  mongoDbQueue(db, 'alerts');
})
app.post('/add', (req, res) => { 
    queue.clean((err) => {
        // All processed (ie. acked) messages have been deleted
    })
            console.log("connected")
            console.log(req.body)
            queue.add(req.body, (err, id) => {
                // Message with payload 'Hello, World!' added.
                // 'id' is returned, useful for logging.
                res.send('Alert added succefully!')
            })               
    
})

app.get('/getLast',(req,res)=>{
        console.log("connected")
        queue.get((err, msg) => {
            console.log('msg.id=' + msg.id)
            console.log('msg.ack=' + msg.ack)
            console.log('msg.payload=' + msg.payload)
            console.log('msg.tries=' + msg.tries)
            res.send(msg);
            queue.ack(msg.ack, (err, id) => {
                // this message has now been removed from the queue
               // console.log("clean :"+id+"\n");
            })
            queue.size((err, count) => {
                console.log('This queue has %d current messages', count)
            })
         //   console.log("size : "+queue.size())
        })
       
 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})






