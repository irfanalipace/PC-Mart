import ApiService from "../services/apiService";

export function getDashboard(val) {
  return new Promise((resolve, reject) => {
    ApiService.get("/dashboard", null, { type: val })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
