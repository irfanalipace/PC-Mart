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
