// @desc    Render home page
// @route   GET /
exports.getHome = (req, res) => {
  res.render('index', {
    title: 'MixTrip - Travel Route Planning'
  });
};

// @desc    Render login page
// @route   GET /login
exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Login - MixTrip'
  });
};

// @desc    Render register page
// @route   GET /register
exports.getRegister = (req, res) => {
  res.render('register', {
    title: 'Register - MixTrip'
  });
};

// @desc    Render dashboard page
// @route   GET /dashboard
exports.getDashboard = (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - MixTrip'
  });
};

// @desc    Render error page
// @route   GET /error
exports.getError = (req, res) => {
  res.render('error', {
    title: 'Error',
    message: req.query.message || 'Something went wrong. Please try again later.'
  });
};

// @desc    Render explore page
// @route   GET /explore
exports.getExplore = (req, res) => {
  res.render('explore', {
    title: 'Explore Trips - MixTrip'
  });
};
