const express = require('express')
const app = express()
const session = require('express-session')
const usePassport = require('./config/passport')
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

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

//setting static
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)



app.listen(port, () => {
  console.log(`Express is listening on localhost:${3000}`);
});