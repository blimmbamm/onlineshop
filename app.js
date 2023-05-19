const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
console.log(process.env);

const database = require("./data/database");

const express = require("express");

const expressSession = require("express-session");
const sessionOptions = require("./config/session");

const checkLoginStatus = require("./middlewares/check-authentication");
const setCartToSessionAndLocals = require("./middlewares/cart-middleware");
const {
  csrfMiddleware,
  csrfErrorHandler,
  doubleCsrfProtection,
} = require("./middlewares/csrf-middleware");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");
const sessionUserDataMiddleware = require("./middlewares/session-user-data-middleware");

const productRoutes = require("./routes/product-routes");
const shoppingCartRoutes = require("./routes/cart-routes");
const authenticationRoutes = require("./routes/authentication-routes");
const sharedRoutes = require("./routes/shared-routes");

const cookieParser = require("cookie-parser");

let port = 3000;
if(process.env.PORT){
    port = process.env.PORT;
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(expressSession(sessionOptions()));
app.use(cookieParser(process.env.cookieParserSecret));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(checkLoginStatus);
app.use(setCartToSessionAndLocals);

app.use(csrfMiddleware, doubleCsrfProtection, csrfErrorHandler);

app.use(sessionUserDataMiddleware);

app.use(productRoutes);
app.use(shoppingCartRoutes);
app.use(authenticationRoutes);
app.use(sharedRoutes);

app.use(errorHandlerMiddleware);

app.use(notFoundMiddleware);

database
  .initializeDatabase()
  .then(() => app.listen(port))
  .catch(() => console.log("Connecting to the database failed."));


