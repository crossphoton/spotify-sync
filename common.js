function getParams() {
  let url = new URL(location.href);
  return url.searchParams;
}

function getUserLink(user) {
  let url = new URL(location.href);

  return `${url.origin}/api/cp/${user}`;
}

let params = getParams();
let user = params.get("user");
if (user) {
  document.getElementById("your-link").innerHTML = `<a href=${getUserLink(
    user
  )}>Your link: ${getUserLink(user)}</a>`;
}

document.getElementById("refresh-cp").addEventListener("click", (e) => {
  e.preventDefault();
  if (user) {
    window.location.href = `/api/cp/${user}`;
  }
});
