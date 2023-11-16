import ApiService from "../services/apiService";

export function getDashboard() {
  return new Promise((resolve, reject) => {
    ApiService.get("/dashboard")
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
