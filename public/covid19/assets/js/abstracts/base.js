import { urlBase } from "../util/VarGlobales.js";

const getToken = async (userCredentials) => {
  try {
    const {
      data: { token },
    } = await axios.post(`${urlBase}/api/login`, userCredentials);
    localStorage.setItem("token", token);
    localStorage.setItem("currentPage", "pageCovidChartHome");
  } catch (error) {
    throw error;
  }
};

export { getToken };
