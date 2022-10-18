//Carregando modulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const user = require("./routes/usuario")
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const passport = require("passport")
require("./config/auth")(passport)

//Configurações
//Session
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

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
app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ date: 'desc' }).then((postagem) => {
        res.render("index", { postagem: postagem })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens!")
        res.redirect("/404")
    })
})

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Esta postagem não existe!")
            res.redirect("/")
        }
    }).catch((erro) => {
        req.flash("error_msg", "Erro interno!")
        res.redirect("/")
    })
})

app.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({ date: 'desc' }).then((categorias) => {
        res.render("categorias/index", { categorias: categorias })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias!")
        res.redirect("/")
    })
})

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {
                res.render("categorias/postagens", { postagens: postagens, categoria: categoria })
            }).catch((erro) => {
                req.flash("error_msg", "Houve um erro ao listar os posts!")
                res.redirect("/")
            })
        } else {
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/")
        }
    }).catch((erro) => {
        req.flash(("error_msg", "Erro interno ao carregar página desta categoria!"))
        res.redirect("/")
    })
})

app.get('/404', (req, res) => {
    res.send("Erro 404!")
})

app.use('/admin', admin)
app.use('/usuarios', user)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})
