import axios from "axios";
// import { toast } from "react-toastify";
import { destroyToken } from "./authService";

/**
 * Service to call HTTP request via Axios
 */

const ACCEPTED_ERROR_CODES = [400, 401, 404, 403, 422];

const ApiService = {
  instance: null,
  init() {
    if (!this.instance) {
      const envbaseURL = import.meta.env.VITE_API_BASE_URL;
      console.log(envbaseURL, "envbaseURL");
      this.instance = axios.create({
        withCredentials: false,
        baseURL: envbaseURL,
      });
      // https://ems.omnioptimzer.com/api
      // this.instance.defaults.baseURL = baseUrl;
      this.instance.defaults.headers["content-type"] = "application/json";
    }
  },

  /**
   * Set the default HTTP request headers
   */

  setHeader(header, val) {
    this.instance.defaults.headers[header] = val;
  },

  setAuthToken(token) {
    this.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {*}
   */

  get(resource, slug = "", params = {}, payload = {}) {
    return new Promise((resolve, reject) => {
      const url = `${resource}${slug ? `/${slug}` : ""}`;
      this.instance
        .get(url, { params, data: payload })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            destroyToken();
          }
          if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
          }
          reject(error.response);
        });
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params = {}, data = {}) {
    return new Promise((resolve, reject) => {
      this.instance
        .post(`${resource}`, data, { params })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            destroyToken();
          }
          if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            console.log("in api service: ", error);
            // toast.error("Something Went Wrong");
          }
          reject(error.response);
        });
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */

  put(resource, params) {
    return new Promise((resolve, reject) => {
      this.instance
        .put(`${resource}`, params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            destroyToken();
          }
          if (!ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            // toast.error("Something Went Wrong");
          }
          reject(error.response);
        });
    });
  },

  delete(resource) {
    return new Promise((resolve, reject) => {
      this.instance
        .delete(resource)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            destroyToken();
            // window.reload.location
          }
          if (ACCEPTED_ERROR_CODES.includes(error?.response?.status)) {
            // toast.error("Something Went Wrong");
          }
          reject(error.response);
        });
    });
  },
};

ApiService.init();
export default ApiService;
