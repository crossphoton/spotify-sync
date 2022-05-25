const { SPOTIFY_REDIRECT_URL } = require("../src/spotify");

module.exports = (_req, res) => {
  res.redirect(SPOTIFY_REDIRECT_URL.toString());
};
