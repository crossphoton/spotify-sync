const { getAccessToken, getUser } = require("../../src/spotify");
const { findUserWithEmail, newUser } = require("../../src/db");

module.exports = async (req, res) => {
  try {
    const { code } = req.query;

    let tokens = await getAccessToken(code);
    if (tokens.status != 200) return res.status(500).send("Server Error");
    tokens = await tokens.json();
    console.log("token: ", tokens);

    let user = await getUser(tokens.access_token);
    if (user.status != 200) return res.status(500).send("Server Error");
    user = await user.json();
    console.log("user: ", user);

    let inDb = await findUserWithEmail(user["email"]);
    if (inDb) {
      res.send(
        `Use this link <a href="/api/cp/${inDb.id}">/api/cp/${inDb.id}</a>`
      );
    } else {
      let id = await newUser({
        email: user.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      res.send(`Use this link <a href="/api/cp/${id}">/api/cp/${id}</a>`);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send("some error occured");
  }
};
