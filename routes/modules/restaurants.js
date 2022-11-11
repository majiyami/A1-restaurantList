const express = require('express')
const router = express.Router()
const restaurantList = require('../../models/restaurant')

//search restaurants
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  return restaurantList.find()
    .lean()
    .then((restaurant) => {
      const restaurantsSearch = restaurant.filter((data) => {
        return data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      })
      res.render('index', { restaurants: restaurantsSearch, keyword: keyword })
    })
    .catch(error => console.log(error))
})

//add new restaurant
router.get('/restaurants/new', (req, res) => {
  return res.render('new')
})


router.post('/restaurants', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userId = req.user._id
  return restaurantList.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//preview restaurant
router.get('/restaurants/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  restaurantList.findOne({ _id, userId })
    .lean()
    .then(restaurants => res.render('show', { restaurants }))
    .catch(error => console.log(error))
})

//edit restaurant
router.get('/restaurants/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return restaurantList.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/restaurants/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return restaurantList.findOne({ _id, userId })
    .then((restaurant) => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

//delete restaurant
router.delete('/restaurants/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return restaurantList.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router