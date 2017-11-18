const redirect = {};

redirect.ifNotAuthorized = (route) =>
  (req, res, next) => (req.user.username !== req.params.username? res.redirect(route) : next());

module.exports = redirect;