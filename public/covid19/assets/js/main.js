import {
  urlBase,
  btnNavInicio,
  btnNavSituacionChile,
  btnNavLogin,
  btnNavLogOut,
  btnModalLogin,
} from "./util/VarGlobales.js";
import { covidChart, covidTable } from "./util/Inicio.js";
import { getToken } from "./abstracts/base.js";
import { graficoChile } from "./util/SituacionChile.js";

const activarMenu = () => {
  $(btnNavSituacionChile).toggleClass("d-none");
  $(btnNavLogin).toggleClass("d-none");
  $(btnNavLogOut).toggleClass("d-none");
};

const currentPage = () => {
  const page = localStorage.getItem("currentPage");
  if (page) {
    if (page == "pageCovidChartHome") {
      $(btnNavInicio).addClass("active");
      $(btnNavSituacionChile).removeClass("active");
      $("#covidChartHome").removeClass("d-none");
      $("#situacionChile").addClass("d-none");
    }
    if (page == "pageSituacionChile") {
      graficoChile();
      $(btnNavInicio).removeClass("active");
      $(btnNavSituacionChile).addClass("active");
      $("#covidChartHome").addClass("d-none");
      $("#situacionChile").removeClass("d-none");
    }
  } else {
    $(btnNavInicio).addClass("active");
    localStorage.setItem("currentPage", "pageCovidChartHome");
    $(btnNavSituacionChile).removeClass("active");
    $("#covidChartHome").removeClass("d-none");
    $("#situacionChile").addClass("d-none");
  }
};

btnNavInicio.addEventListener("click", () => {
  localStorage.setItem("currentPage", "pageCovidChartHome");
  currentPage();
});

btnNavSituacionChile.addEventListener("click", () => {
  localStorage.setItem("currentPage", "pageSituacionChile");
  currentPage();
});

btnModalLogin.addEventListener("click", async () => {
  const inputsFormLogin = [...document.querySelector("form")];
  const [email, password] = inputsFormLogin.map(({ value }) => value);
  const userCredentials = { email, password };
  try {
    await getToken(userCredentials);
    $("#logInModal").modal("toggle");
    Swal.fire("Bienvenido", "", "success");
    activarMenu();
  } catch (error) {
    Swal.fire("Ha ocurrido un error", `${error}.`, "error");
  }
});

btnNavLogOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentPage");

  $(btnNavSituacionChile).toggleClass("d-none");
  $(btnNavLogin).toggleClass("d-none");
  $(btnNavLogOut).toggleClass("d-none");

  $("#situacionChile").addClass("d-none");
  currentPage();

  Swal.fire("Sesion cerrada", "", "success");
});

(async () => {
  const {
    data: { data: countriesCovid },
  } = await axios.get(`${urlBase}/api/total`);
  covidChart(countriesCovid);
  covidTable(countriesCovid);
  if (localStorage.getItem("token")) activarMenu();
  currentPage();
})();
