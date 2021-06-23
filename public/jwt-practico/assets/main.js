import { postData, getPost, fillTable } from "./function.js";

const form = document.querySelector("form");
/* const baseUrl = "http://localhost:3000/api"; */

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [email, password] = [...document.querySelectorAll("input")].map(
    (i) => i.value
  );
  const userCredentials = { email, password };
  await postData(userCredentials);
  const posts = await getPost();
  fillTable(posts);
});

(async () => {
  const jwt = localStorage.getItem("token");
  if (jwt) {
    const posts = await getPost();
    fillTable(posts);
  }
})();
