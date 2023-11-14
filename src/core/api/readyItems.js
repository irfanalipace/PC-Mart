import ApiService from "../services/apiService";

export function getReadyItems(params) {
  return new Promise((resolve, reject) => {
    ApiService.post("/filter-items", params, { status: "ready" })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getNonReadyItems(params) {
  return new Promise((resolve, reject) => {
    ApiService.post("/filter-items", params, { status: "non_ready" })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function importItemsFile(data) {
  ApiService.setHeader("content-type", "multipart/form-data");
  const formData = new FormData();
  formData.append("file", data);
  return new Promise((resolve, reject) => {
    ApiService.post("/file-upload", formData)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
