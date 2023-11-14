import axios from 'axios';

const {
  API_HOST: host,
  API_PROTOCOL: protocol,
  API_NAMESPACE: namespace,
} = process.env;

let baseURL = `${protocol}://${host}`;
baseURL += namespace ? `/${namespace}` : '';

const instance = axios.create({
  baseURL,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);

    return [];
  }
);

export default instance;
