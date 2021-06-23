import { urlBase } from "./VarGlobales.js";

const covidChart = (countriesCovid) => {
  const paisesCasosActivos = countriesCovid.filter(
    ({ active }) => active > 1000000
  );

  paisesCasosActivos.sort((a, b) => b.active - a.active);

  const labelsCountries = [];
  const confirFormedCountries = [];
  const deathsForCountries = [];
  const recoveForredCountries = [];
  const activeForCountries = [];

  paisesCasosActivos.map(
    ({ active, confirmed, deaths, recovered, location }) => {
      activeForCountries.push(active);
      confirFormedCountries.push(confirmed);
      deathsForCountries.push(deaths);
      recoveForredCountries.push(recovered);
      labelsCountries.push(location);
    }
  );

  const data = {
    labels: labelsCountries,
    datasets: [
      {
        label: "Casos Activos",
        data: activeForCountries,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Casos Confirmados",
        data: confirFormedCountries,
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Casos Muertos",
        data: deathsForCountries,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Casos Recuperados",
        data: recoveForredCountries,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Paises con Covid19",
          fullSize: true,
          font: {
            size: 25,
            weight: "bold",
          },
        },
      },
    },
  };

  /* const myChart =  */
  new Chart(document.getElementById("myChart"), config);
};

const covidTable = (countriesCovid) => {
  const rows = countriesCovid
    .map(({ location, active, confirmed, deaths, recovered }) => {
      return `
      <tr>
        <td class="align-middle text-left">${location}</td>
        <td class="align-middle text-right">${active}</td>
        <td class="align-middle text-right">${confirmed}</td>
        <td class="align-middle text-right">${deaths}</td>
        <td class="align-middle text-right">${recovered}</td>
        <td class="align-middle text-center">
          <a href="#" class="btn btn-dark btn-sm"
            onclick="verDetalle('${location}')"
            data-toggle="modal" data-target="#locationModal">
            Ver detalle
          </a>
        </td>
      </tr>
    `;
    })
    .join("");

  const template = `
    <table class="table table-bordered table-striped table-hover table-responsive-md">
      <thead class="thead-dark">
        <tr>
          <th class="text-center text-uppercase">location</th>
          <th class="text-center text-uppercase">active</th>
          <th class="text-center text-uppercase">confirmed</th>
          <th class="text-center text-uppercase">deaths</th>
          <th class="text-center text-uppercase">recovered</th>
          <th class="text-center text-uppercase">detalle</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  document.querySelector("#covidTable").innerHTML = template;

  $("table").DataTable({
    order: [[0, "asc"]],
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    },
  });
};

window.verDetalle = async (location) => {
  try {
    $("#loadModal").modal("toggle");
    const regex = / /gi; // ! Crea una exprecion regular global para buscar espacios
    location = location.replace(regex, "_"); // ! Remplaza los espacios por gion bajo

    const sectionSituacionChile = document.querySelector("#modalChartLocation");
    sectionSituacionChile.innerHTML = '<canvas id="myChartLocation"></canvas>';

    const {
      data: {
        data: { active, confirmed, deaths, recovered },
      },
    } = await axios.get(`${urlBase}/api/countries/${location}`);

    const dataChar = {
      labels: [
        "Casos Activos",
        "Casos Confirmados",
        "Casos Muertos",
        "Casos Recuperados",
      ],
      datasets: [
        {
          label: "",
          data: [active, confirmed, deaths, recovered],
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(75, 192, 192, 0.5)",
          ],
        },
      ],
    };

    const config = {
      type: "polarArea",
      data: dataChar,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: `${location}`,
            fullSize: true,
            font: {
              size: 25,
              weight: "bold",
            },
          },
        },
      },
    };

    new Chart(document.getElementById("myChartLocation"), config);
  } catch (error) {
    Swal.fire("", error, "error");
  } finally {
    $("#loadModal").modal("toggle");
  }
};

export { covidChart, covidTable };
