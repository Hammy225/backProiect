import express from 'express'
import cors from 'cors'
import { sequelize } from './sequelize.js'
import { router } from './Routers/router.js'
import cookieparser from 'cookie-parser';
import morgan from 'morgan';


const app = express()
app.use(express.json()) // The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads

app.use(express.urlencoded({ extended: true }))

app.use(cors());
app.use(cookieparser());
app.use('/api', router);

// Dev logging middleware
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

 app.listen(5001, async () => {
  console.log('Express web server running on port 5001')
  try {
    await sequelize.authenticate()
    console.log('Connection has been established!')
  } catch (err) {
    console.err('Unable to connect to the database!', err)
  }
})


