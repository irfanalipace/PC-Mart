import ApiService from "../services/apiService";

export function getBatchNumber() {
  return new Promise((resolve, reject) => {
    ApiService.get("/batch-number-dropdown")
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
