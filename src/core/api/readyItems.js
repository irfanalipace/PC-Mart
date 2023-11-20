import ApiService from "../services/apiService";

export function getReadyItems(params, batchNumber, serialNumber) {
  return new Promise((resolve, reject) => {
    ApiService.post("/filter-items", params, {
      status: "ready",
      batch_number: batchNumber,
      serial_number: serialNumber,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getNonReadyItems(params, batchNumber, serialNumber) {
  return new Promise((resolve, reject) => {
    ApiService.post("/filter-items", params, {
      status: "non_ready",
      batch_number: batchNumber,
      serial_number: serialNumber,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function getSolditems(params, batchNumber, serialNumber) {
  return new Promise((resolve, reject) => {
    ApiService.post("/filter-items", params, {
      status: "sold",
      batch_number: batchNumber,
      serial_number: serialNumber,
    })
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
    ApiService.post("/file-upload", null, formData)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
