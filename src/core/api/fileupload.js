import ApiService from "../services/apiService";

export function getUploadFile(params, batchNum) {
  return new Promise((resolve, reject) => {
    const queryParams = { ...params, batch_number: batchNum };
    ApiService.get("/get-files", null, queryParams)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
export function DownloadSingleFile(id) {
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

export function DownloadSampleFile() {
  return new Promise((resolve, reject) => {
    ApiService.get(`/sample-download`)
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Use window.open with a data URL to trigger the download
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, "_blank");

        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
