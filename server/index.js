
const express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv');
const cors = require('cors');
const UserRouter = require('./routes/User')
const ItemRouter = require('./routes/Item')
const DetailRouter = require('./routes/Detail')
const FoodRouter = require('./routes/Food')
const PlanRouter = require('./routes/Plan')
 dotenv.config();
require('./db/Connect')
app.use(cors());
app.use(express.json());

app.use('/api/user', UserRouter)
app.use('/api/item', ItemRouter)
app.use('/api/detail', DetailRouter)
app.use('/api/food', FoodRouter)
app.use('/api/plan', PlanRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})