const handleSessionUserData = (req, res, next) => {    
    if(req.session.deleteSignupDataOnNextRequest){
        req.session.signupData = null;
        req.session.deleteSignupDataOnNextRequest = null;
    }
    next();
};

module.exports = handleSessionUserData;