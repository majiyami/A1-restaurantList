const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')
//設定路徑
const restaurantList = require('./models/restaurant')

const port = 3000


//express template
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setting static
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${3000}`);
});