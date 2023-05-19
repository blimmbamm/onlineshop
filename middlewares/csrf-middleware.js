const { doubleCsrf } = require("csrf-csrf");

const { invalidCsrfTokenError, validateRequest, doubleCsrfProtection, generateToken } = doubleCsrf({
    getSecret: () => "something",
    cookieName: "x-csrf-token",
    getTokenFromRequest: (req) => req.body.csrfToken,
  });


// function csrfMiddleware(csrfTokenGenerator){
//     return(
//         (req, res, next) => {
//             res.locals.csrfToken = csrfTokenGenerator(res, req);
//             next();
//         }
//     )
// }

const csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = generateToken(res, req);
    // console.log(res.locals.csrfToken);
    next();
};

const csrfErrorHandler = (error, req, res, next) => {
  if (error == invalidCsrfTokenError) {
    console.log("csrf Error handler handling...");
    error.code = 403;
    next(error);
  }else{
    next();
  } 

};


module.exports = {csrfMiddleware, csrfErrorHandler, doubleCsrfProtection};
// module.exports = csrfMiddleware;