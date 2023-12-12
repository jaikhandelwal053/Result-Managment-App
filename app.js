const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const app = express();

// port use 3000
const port = 3000

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

//connect to mongodb and listen to requests
const mongoose = require('mongoose'); 
mongoose.connect("mongodb+srv://jaikhandelwal0987:mongo123@cluster0.vsoy04k.mongodb.net/result_management?retryWrites=true&w=majority",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));


// Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(express.json());
app.use(express.urlencoded());


// Set Templating Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views',  "src/views");


// routes
const teacherRoutes = require('./src/routes/teacher')
const studentRoutes = require('./src/routes/student');
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);

//routes
app.get("/", (req, res) => {
  res.render("index");
});



// Listen port on 3000
app.listen(port, () => console.log(`Listen on port at http://localhost:${port}`));

// 404
app.use((req, res, next) => {
  // res.status(404).send("Sorry can't find that!")
  res.status(404).render("404", {title:"404"})
  next();
})

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
