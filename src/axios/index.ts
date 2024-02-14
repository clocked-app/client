import axios, { Axios } from "axios";

const getApiUrlEnvVar = async (): Promise<string> => {
  const response = await axios.get("/env");
  return response.data['VITE_API_URL'] ?? null;
};

const buildInstance = async (mode: string = 'production'): Promise<Axios> => {
  let apiUrl = '';
  if (mode == 'production') {
    apiUrl = await getApiUrlEnvVar();
  } else {
    apiUrl = import.meta.env.VITE_API_URL;
  }
  return axios.create({
    baseURL: apiUrl
  });
};

const http = await buildInstance(import.meta.env.MODE);

export { http, buildInstance };
