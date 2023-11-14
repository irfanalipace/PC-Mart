import ApiService from "../services/apiService";

export function getUploadFile(params) {
  return new Promise((resolve, reject) => {
    ApiService.get("/get-files", null, params)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function downloadFile(id) {
  return new Promise((resolve, reject) => {
    ApiService.get(`/file-download/${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
