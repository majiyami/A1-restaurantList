const mongoose = require('mongoose')

// model
const restaurant = require('../restaurant')

//restaurant.json
const restaurantList = require("../../restaurant.json").results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  //create seeds material
  restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantlist done!")
    })
    .catch(error => console.log(error))
    .finally(() => db.close())
    

})