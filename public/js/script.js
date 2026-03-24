var password = document.getElementById("password");
var toggler = document.querySelector("#toggler img");

showHidePassword = () => {
    if (password.type == "password") {
          password.setAttribute("type", "text");
          toggler.setAttribute("src", "/images/site/open-eye.png");
        } else {
          toggler.setAttribute("src", "/images/site/closed-eye.png");
          password.setAttribute("type", "password");
        }
      };

if (toggler) {
    toggler.addEventListener('click', showHidePassword);
}
