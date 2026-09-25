
import express from  'express'
import {config} from 'dotenv'
import cors from 'cors'
import { ConnectDB } from './config/mongoDB.js'
import { userRouter } from './routes/userRouter.js'
import { connectWhatsApp } from './config/whatsapp.js'


const app=express()

config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
// routes
app.use('/api',userRouter)

ConnectDB()
const startServer =
  async () => {

    try {

      // -----------------------------------------------
      // MongoDB
      // -----------------------------------------------



      // -----------------------------------------------
      // WhatsApp
      // -----------------------------------------------

      await connectWhatsApp();


      // -----------------------------------------------
      // Express
      // -----------------------------------------------

      app.listen(
        3000,
        () => {

          console.log(
            `🚀 Server running on port ${3000}`
          );

        }
      );


    } catch (error) {

      console.error(
        "❌ Server startup error:",
        error
      );


      process.exit(1);

    }

  };


startServer();
// creating the connection 

console.log(process.env.MONGO_URL)
app.get('/',(req,res)=>{
    res.json('landing page is here ')
})


