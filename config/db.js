if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "mongodb+srv://david:root01021020@blogapp.ijfsjkq.mongodb.net/?retryWrites=true&w=majority" }
} else {
    module.exports = { mongoURI: "mongodb://localhost/blogapp" }
}