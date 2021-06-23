const urlBase = "/api";
const previusPage = document.querySelector("#previusPage");
const nextPage = document.querySelector("#nextPage");

const getToken = async (userCredentials) => {
  try {
    const {
      data: { token },
    } = await axios.post(`${urlBase}/login`, userCredentials);
    localStorage.setItem("token", token);
    localStorage.setItem("currentPage", 1);
  } catch (error) {
    throw error;
  }
};

const getPhotos = async () => {
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      const {
        data: { data: photos },
      } = await axios.get(`${urlBase}/photos`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return photos;
    } else {
      const error = "Token invalido...";
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const getPhotosForPage = async () => {
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      const {
        data: { data: photos },
      } = await axios.get(
        `${urlBase}/photos?page=${localStorage.getItem("currentPage")}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      return photos;
    } else {
      const error = "Token invalido...";
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const feedCard = (photos) => {
  const cards = photos
    .map(({ author, download_url, url }) => {
      const card = `
      <div class="card">
        <a href="${url}" target="_blank">
          <img src="${download_url}" class="card-img-top">
        </a>
        <div class="card-footer">${author}</div>
      </div>
    `;
      return card;
    })
    .join("");

  const templateHTML = `
    <div class="card-columns">${cards}</div>
  `;

  document.querySelector("#cardColumns").innerHTML = templateHTML;
  document.querySelector("#currentPage").innerHTML = localStorage.getItem("currentPage");
};

const toggleFormAndCard = () => {
  $("form").toggle();
  $("#feedCard").toggleClass("d-none");
};

window.cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentPage");
  toggleFormAndCard();
};

previusPage.addEventListener("click", async () => {
  const currentPage = Number(localStorage.getItem("currentPage"));
  try {
    if (currentPage > 1) {
      localStorage.setItem("currentPage", currentPage - 1);
      await loadPage();
    } else {
      const error = `No se puede retroceder mas...`;
      throw error;
    }
  } catch (error) {
    Swal.fire("error", `${error}`, "error");
  }
});

nextPage.addEventListener("click", async () => {
  const currentPage = Number(localStorage.getItem("currentPage"));
  localStorage.setItem("currentPage", currentPage + 1);
  try {
    const photos = await getPhotosForPage();
    feedCard(photos);
  } catch (error) {
    Swal.fire("error", `${error}.`, "error");
  }
});

const loadPage = async () => {
  try {
    const photos = await getPhotosForPage();
    feedCard(photos);
  } catch (error) {
    throw error;
  }
};

export { getToken, getPhotos, feedCard, toggleFormAndCard, loadPage };
