require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const connection = require("./db.js");
const home = require("./routes/frontend/home");
const signup = require("./routes/frontend/signup");
const dashboard = require("./routes/frontend/dashboard");
const error = require("./routes/frontend/error");
const logout = require("./routes/frontend/logout");
const login = require("./routes/frontend/login");
const reset = require("./routes/frontend/reset");
const resetPassword = require("./routes/frontend/resetPassword");
const googleRoutes = require("./routes/frontend/googleRoutes.js");
const onboarding = require("./routes/frontend/onboarding.js");
const insert = require("./routes/api/insert.js");
const author = require("./routes/api/author.js");
const authMiddleware = require("./utils/authMiddleware.js");
const errorMiddleware = require("./utils/errorMiddleware.js");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const path = require("path");

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

(async function db() {
  await connection();
})();

console.log("hi");

const oneWeek = 1000 * 60 * 60 * 24 * 7;

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wikiDB"}),
    cookie: { maxAge: oneWeek },
    resave: false 
}));

app.use("/api",authMiddleware);

///////////////////////////routes////////////////////////////////
app.get("/",(req,res)=>{
  res.redirect("/home");
});
app.use("/api",insert);
app.use("/api",author);
app.use("/home",home);
app.use("/signup",signup);
app.use("/dashboard",dashboard);
app.use("/logout",logout);
app.use("/login",login);
app.use("/reset",reset);
app.use("/reset-password",resetPassword);
app.use("/google",googleRoutes);
app.use("/user",onboarding);
app.use("/error",error);


app.use(errorMiddleware);

app.listen(3000 || process.env.PORT,function(){
  console.log("server is connected to port 3000");
});
