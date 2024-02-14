import axios, { type AxiosInstance } from "axios";

const getApiUrlEnvVar = async (): Promise<string> => {
  const response = await axios.get("/env");
  return response.data['VITE_API_URL'] ?? null;
};

const buildInstance = async (): Promise<AxiosInstance> => {
  let apiUrl = '';
  if (import.meta.env.PROD) {
    apiUrl = await getApiUrlEnvVar();
  } else {
    apiUrl = import.meta.env.VITE_API_URL;
  }
  return axios.create({
    baseURL: apiUrl
  });
};

const http = await buildInstance();

export { http };
