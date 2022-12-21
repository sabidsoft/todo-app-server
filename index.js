require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

const uri = process.env.DATABASE
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const run = async () => {
    try{
        const todosCollection = client.db('todoApp').collection('todoTask')

        app.get('/todo', async (req, res) => {
            const query = {}
            const todoTasks = await todosCollection.find(query).toArray()
            res.send(todoTasks)
        })

        app.get('/todo/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const task = await todosCollection.findOne(query)
            res.send(task)
        })

        app.patch('/todo/:id', async (req, res) => {
            const id = req.params.id
            const task = req.body.task
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    task: task
                }
            }
            const options = { upsert: true }
            const result = await todosCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        app.post('/todo', async (req, res) => {
            const todoTask = req.body
            const result = await todosCollection.insertOne(todoTask)
            res.send(result)
        })

        app.delete('/todo', async(req, res) => {
            const query = { _id: ObjectId(req.query.id) }
            const result = await todosCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {}
}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Home Page')
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})