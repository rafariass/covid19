const baseUrl = "/api";

const postData = async (userCredentials) => {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(userCredentials),
    });
    const { token } = await response.json();
    localStorage.setItem("token", token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

const getPost = async () => {
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      const response = await fetch(`${baseUrl}/posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const { data } = await response.json();
      return data;
    } else {
      const error = `Token invalido...`;
      throw error;
    }
  } catch (error) {
    console.log(error);
  }
};

const fillTable = (posts) => {
  const rows = posts
    .map(({ title, body }) => {
      const template = `
      <tr>
        <td>${title}</td>
        <td>${body}</td>
      </td>
    `;
      return template;
    })
    .join("");
  document.querySelector("tbody").innerHTML = rows;
  toggleFormAndTable();
};

const toggleFormAndTable = () => {
  $(`form`).toggle();
  $(`#js-table-wrapper`).toggleClass("d-none");
};

export { postData, getPost, fillTable };
