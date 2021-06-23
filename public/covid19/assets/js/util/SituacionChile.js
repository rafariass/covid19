import { urlBase } from "./VarGlobales.js";

const graficoChile = async () => {
  $("#loadModal").modal("toggle");

  const sectionSituacionChile = document.querySelector("#situacionChile");
  sectionSituacionChile.innerHTML = '<canvas id="covidTableChile"></canvas>';

  const jwt = localStorage.getItem("token");

  if (!jwt) {
    Swal.fire("Error", "Error de autenticacion.", "error");
    return false;
  }

  try {
    const header = { headers: { Authorization: `Bearer ${jwt}` } };
    const confirmed = axios.get(`${urlBase}/api/confirmed`, header);
    const deaths = axios.get(`${urlBase}/api/deaths`, header);
    const recovered = axios.get(`${urlBase}/api/recovered`, header);

    await Promise.all([confirmed, deaths, recovered])
      .then(([
          { data: { data: confirmed }, },
          { data: { data: deaths }, },
          { data: { data: recovered }, },
        ]) => {
          const labels = [];
          const totalConfirmed = [];
          confirmed.forEach(({ date, total }) => {
            labels.push(date);
            totalConfirmed.push(total);
          });
          const totalDeaths = deaths.map(({ total }) => total);
          const totalRecovered = recovered.map(({ total }) => total);

          const dataChar = {
            labels: labels,
            datasets: [
              {
                label: "Confirmados",
                data: totalConfirmed,
                backgroundColor: "rgba(255, 206, 86, 0.5)",
                borderColor: "rgba(255, 206, 86, 1)",
              },
              {
                label: "Muertos",
                data: totalDeaths,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
              },
              {
                label: "Recuperados",
                data: totalRecovered,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          };

          const config = {
            type: "line",
            data: dataChar,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Situacion Chile",
                  fullSize: true,
                  font: {
                    size: 25,
                    weight: "bold",
                  },
                },
              },
            },
          };

          new Chart(
            document.getElementById("covidTableChile"),
            config
          ).getContext("2d");

          $("#loadModal").modal("toggle");
        }
      )
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    $("#loadModal").modal("toggle");
    Swal.fire("Error", `${error}`, "error");
  }
};

export { graficoChile };
