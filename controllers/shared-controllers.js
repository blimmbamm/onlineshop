
const getSuccessPage = (req, res) => {
    res.render("success", {successMessage: req.session.successMessage});
};

const getAbout = (req, res) => {
    res.render("about");
}

module.exports = {
    getSuccessPage: getSuccessPage,
    getAbout: getAbout
}

