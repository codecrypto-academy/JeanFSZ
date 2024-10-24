import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
const port = 3333

app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})