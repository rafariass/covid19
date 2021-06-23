import { getToken, getPhotos, feedCard, toggleFormAndCard, loadPage } from "./function.js";

const btnEntrar = document.querySelector("button");
btnEntrar.addEventListener("click", async (event) => {
  event.preventDefault();

  const inputsFormLogin = [...document.querySelectorAll("input")];
  const [email, password] = inputsFormLogin.map(({ value }) => value);
  const userCredentials = { email, password };
  try {
    await getToken(userCredentials);
    const photos = await getPhotos();
    feedCard(photos);
    toggleFormAndCard();
  } catch (error) {
    Swal.fire("error", `${error}.`, "error");
  }
});

(async () => {
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      loadPage();
      toggleFormAndCard();
    }
  } catch (error) {
    Swal.fire("error", `${error}.`, "error");
  }
})();
