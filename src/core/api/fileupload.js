import axios from "axios";
import ApiService from "../services/apiService";
import { downloadFile } from "../utils/helpers";

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

export function DownloadSingleFile(id) {
  const apiUrl = `http://localhost:8000/file-download/${id}`;
  axios
    .get(apiUrl)
    .then((response) => {
      downloadFile(apiUrl);
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}
