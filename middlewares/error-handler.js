const handleErrors = (error, req, res, next) => {
  console.log(error.code);
  if (error.code === 404) {
    
    return res.status(404).render("404");
  }

  if(error.code === 403){
    console.log("executed?");
    return res.status(403).render("403");
  }

  res.status(500).render("500");
};

module.exports = handleErrors;
