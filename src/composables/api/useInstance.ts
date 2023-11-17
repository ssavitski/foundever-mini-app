import axios from 'axios';
import { useToast } from "vue-toast-notification";

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


export default () => {
  const $toast = useToast();

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(error);
      
      $toast.open({
        message: error,
        type: 'error',
      });

      return [];
    }
  );

  return instance;
};
