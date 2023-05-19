const ShoppingCart = require("../models/shopping-carts");
const User = require("../models/users");

const getLogin = (req, res) => {
  res.render("login", { email: req.session.email });
};

const login = async (req, res, next) => {
  req.session.signupData = null; // needed?!

  const user = new User(req.body.email);

  try {
    if (!user.passwordMatches(req.body.password)) {
      return res.redirect("/login"); // redirect to login and show error message OR
    }
  } catch (error) {
    return next(error);
  }

  req.session.isAuthenticated = true;
  req.session.email = req.body.email;

  let shoppingCart;
  try {
    shoppingCart = await user.getShoppingCart();
    const shoppingCartFromSession = new ShoppingCart(req.session.shoppingCart);
    await shoppingCart.mergeShoppingCarts(shoppingCartFromSession);
    await user.updateShoppingCart(shoppingCart);
  } catch (error) {
    return next(error);
  }

  req.session.shoppingCart = shoppingCart;
  res.redirect("/");
};

const getSignup = (req, res) => {
  // check for session data, prefilled inputs and add them to template
  // req.session.signupDataAge++;

  req.session.deleteSignupDataOnNextRequest =
    !req.session.deleteSignupDataOnNextRequest;
  res.render("signup", {
    signupData: req.session.signupData ? req.session.signupData : {},
  });
};

const signup = async (req, res, next) => {
  // data was checked in frontend, so:
  // create new user object
  // check if user exists
  // yes: redirect to login, prefill email and show message "You already have an account"
  // no: create and save user, render success template with message and link to login

  req.session.signupData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    confirmemail: req.body.confirmemail,
  };

  const emailsDoNotMatch = !(req.body.email == req.body.confirmemail);
  const passwordsDoNotMatch = !(req.body.password == req.body.confirmpassword);

  if (emailsDoNotMatch || passwordsDoNotMatch) {
    req.session.signupData.emailsDoNotMatch = emailsDoNotMatch;
    req.session.signupData.passwordsDoNotMatch = passwordsDoNotMatch;
    return res.redirect("/signup");
  }

  const user = new User(
    req.body.email,
    req.body.firstname,
    req.body.lastname,
    req.body.password
  );

  try {
    if (await user.exists()) {
      req.session.signupData.userExists = true;
      req.session.email = req.body.email;

      return res.redirect("/signup");
    } else {
      await user.save();

      req.session.signupData = null; // needed?
      req.session.email = req.body.email;

      req.session.successMessage = "Your account was successfully created. You can go to login now!";
      res.redirect("success");
    }
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  req.session.isAuthenticated = false;
  res.locals.isAuthenticated = false;

  req.session.shoppingCart = new ShoppingCart();
  res.locals.shoppingCart = req.session.shoppingCart;
  res.render("logout");
};

module.exports = {
  getLogin: getLogin,
  login: login,
  getSignup: getSignup,
  signup: signup,
  logout: logout,
};
