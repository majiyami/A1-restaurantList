const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const User = require('../user')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// model
const restaurant = require('../restaurant')
//restaurant.json
const restaurantList = require("../../restaurant.json").results
const user1 = {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}
const user2 = {
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678'

}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(user1.password, salt))
    .then(hash => User.create({
      name: user1.name,
      email: user1.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      for (i = 0; i < 3; i++) {
        restaurantList[i].userId = userId
      }
      return Promise.all(Array.from(
        { length: 3 },
        (_, i) => restaurant.create(restaurantList[i])
      ))
    })

    .then(() => {
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user2.password, salt))
        .then(hash => User.create({
          name: user2.name,
          email: user2.email,
          password: hash
        }))
        .then(user => {
          const userId = user._id
          for (i = 3; i < 6; i++) {
            restaurantList[i].userId = userId
          }
          return Promise.all(Array.from(
            { length: 3 },
            (_, i) => restaurant.create(restaurantList[i + 3])
          ))
        })
        .catch(err => console.log(err))
        .then(() => {
          console.log('final')
          process.exit()
        })

    })
})