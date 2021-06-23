// ! URL Base para las consultas de la api covid19
const urlBase = "http://localhost:3000";

// ! btn correspondiente al modal de inicio se sesion
const btnModalLogin = document.querySelector("#btnModalLogin");

// ! enlaces correspondientes al menu de navegacion de la pag
const [btnNavInicio, btnNavSituacionChile, btnNavLogin, btnNavLogOut] = [
  ...document.querySelectorAll(".navbar-nav > li"),
];

// ! Anio actual, se usa en el footer
const anioActual = document.querySelector("#anio");
anioActual.innerHTML = new Date().getFullYear();

export {
  urlBase,
  btnNavInicio,
  btnNavSituacionChile,
  btnNavLogin,
  btnNavLogOut,
  btnModalLogin,
};
