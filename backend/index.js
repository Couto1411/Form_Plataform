const app = require('express')()
const db = require('./config/db')
const consign = require('consign')

app.db=db

consign()
.then('./config/passport.js')
.then('./config/middleware.js')
.then('./api/validation.js')
.then('./api')
.then('./config/routes.js')
.into(app)

app.listen(3001, ()=>{
    console.log("Executando back");
})