const db = require('../../config/mongoose')
// model
const restaurant = require('../restaurant')
//restaurant.json
const restaurantList = require("../../restaurant.json").results

db.once('open', () => {
  //create seeds material
  restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantlist done!")
    })
    .catch(error => console.log(error))
    .finally(() => db.close())
    

})