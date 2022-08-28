const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const port = 3000

//express template
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setting static
app.use(express.static("public"));

//route setting
app.get('/', (req, res) => {
  res.render("index", { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  console.log(keyword)
  const searchRestaurant = restaurantList.results.filter(
    (restaurant) => {
      return restaurant.name.toLowerCase().includes(keyword) ||
        restaurant.category.includes(keyword)
    }
  )
  res.render("index", { restaurants: searchRestaurant, keyword: keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurantOne = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  )
  res.render('show', { restaurant: restaurantOne })
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${3000}`);
});