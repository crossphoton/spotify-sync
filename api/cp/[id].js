const { findUserWithId, updateAccessToken } = require("../../src/db");
const { getCurrentPlaying, refreshAccessToken } = require("../../src/spotify");

module.exports = async (req, res) => {
  const { id } = req.query;

  const user = await findUserWithId(id);
  if (!user) return res.status(404).send(NotFound);

  let cp = await getCurrentPlaying(user.access_token);
  if (cp.status === 401) {
    let refresh = await refreshAccessToken(user.refresh_token);
    if (refresh.status != 200) {
      return res.redirect(`/error?user=${id}`);
    }
    refresh = await refresh.json();

    updateAccessToken(id, refresh.access_token);
    cp = await getCurrentPlaying(refresh.access_token);
  }
  if (cp.status > 299) {
    return res.redirect("/error");
  }
  if (cp.status == 200) {
    cp = await cp.json();
    console.log(cp);
    res.redirect(`/spotify?trackId=${cp.item.id}&user=${id}`);
  }
  res.redirect("/nothings-playing");
};
