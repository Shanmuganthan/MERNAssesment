import axios from 'axios';
import {baseURL} from './baseUrl';

const instance = axios.create();

const request = (method, url, data, headers) => new Promise((resolve, reject) => {
  (() => {
    url = baseURL+url;
    
    if (method === 'get') {
      return instance.request({
        url, method, params: data, headers,
      });
    }
    return instance.request({
      url, method, data, headers: {},
    });
  })()
    .then((res) => {
   
        resolve(res.data);
      
    })
    .catch((err) => {
      const { data: error } = err.response || {};
      reject(error);
    });
});

export default  Request = {
  get: (endpoint, data,  headers) => request('get', endpoint, data, headers),
  post: (endpoint, data) => request('post', endpoint, data),
  put: (endpoint, data) => request('put', endpoint, data),
  del: (endpoint, data) => request('delete', endpoint, data),
};