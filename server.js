import express from 'express'
import * as dotenv from 'dotenv'

// library for async error handling, doing the work of every try
// and catch block at controllers and more files
import 'express-async-errors'

//rest of the packages
import cookieParser from 'cookie-parser'
import cors from 'cors'

//security packages
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

//db connection
import connectDB from './db/connect.js'

//middlewares
import headers from './middlewares/headers.js'
import notFound from './middlewares/not-found.js'
import errorHandlerMiddleware from './middlewares/error-handler.js'

//routes
import authRouter from './routes/authRoutes.js'
import currencyRouter from './routes/currencyRoutes.js'
import exchangeRouter from './routes/exchangeRoutes.js'
import userRouter from './routes/userRoutes.js'
import convertRouter from './routes/convertRoutes.js'

dotenv.config()

const app = express()

const corsOptions = {
  origin: true,
  credentials: true,
}

app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(cors(corsOptions))
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1/procon-ce/auth', authRouter)
app.use('/api/v1/procon-ce/currency', currencyRouter)
app.use('/api/v1/procon-ce/exchange', exchangeRouter)
app.use('/api/v1/procon-ce/user', userRouter)
app.use('/api/v1/procon-ce/convert', convertRouter)

app.use(headers)
app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 4000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server listening at PORT ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
