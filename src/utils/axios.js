import axios from "axios";
import storage from "local-storage-fallback";

const LOGIN_ROUTE = "/account/login";
const REFRESH_URL = "/auth/refresh-token";

const token = storage.getItem("access_token");

const API_BASE = (process.env.NODE_ENV === "production" && process.env.REACT_APP_API_BASE) || ""

const axiosInstance = axios.create({
  baseURL: API_BASE + "/api",
  timeout: 8000,
  headers: {
    Authorization: token ? "Bearer " + token : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // get original request from error
    // console.log(error.response);

    const originalRequest = error.config;
    const accessToken = storage.getItem("access_token");
    const refreshToken = storage.getItem("refresh_token");

    // if no error response
    if (!error.response) {
      // console.log("No error response, server might be down");
    }

    // return error not due to authentication
    if (error.response.status !== 401) {
      // console.log("Unhandled error status");
      return Promise.reject(error);
    }

    // logout user if token refresh didn't work
    // add account disabling feature
    if (originalRequest.url === REFRESH_URL) {
      // console.log("Token refresh error");

      storage.removeItem("access_token");
      storage.removeItem("refresh_token");

      window.location.href = LOGIN_ROUTE;

      return Promise.reject(error);
    }

    // refresh accessToken if refreshToken is available
    if (refreshToken) {
      return axiosInstance
        .post(REFRESH_URL, { refreshToken })
        .then(({ data }) => {
          storage.setItem("access_token", data.accessToken);

          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;

          // console.log("resending request to " + originalRequest.url);
          return axiosInstance(originalRequest);
        });
    } else {
      // console.log("Refresh token not available", refreshToken);

      if (accessToken) storage.removeItem("access_token");

      // window.location.reload();
      // window.location.href = LOGIN_ROUTE;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
