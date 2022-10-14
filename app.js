//Carregando modulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")

//Configurações
//Handlebars
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//BodyParser
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("mongoDB conectado...")
}).catch((erro) => {
    console.log("Erro ao se conectar ao mongoDB: " + erro)
})

//public
app.use(express.static(path.join(__dirname, "public")))

//Rotas
app.use('/admin', admin)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})
