import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import categorizaRoute from './routes/categorize.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use("/api/categorize", categorizaRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)
})