const axios = require('axios');

const baseUrls = {
  login: 'https://objects.ummah-app.com/landing/api',
  // Add more base URLs for other API endpoints as needed
  // ...
};

class NetworkHandler {
  async login(username, password) {
    const url = '/login';

    const headers = {
      'Content-Type': 'application/json',
    };
    const data = { username, password };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.login,
      });

      const response = await axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

// // Usage example:
// const networkHandler = new NetworkHandler();

// const username = 'test@olari.com';
// const password = 'test@olari.com';
// networkHandler.login(username, password)
//   .then(responseData => {
//     console.log('Login successful:', responseData);
//   })
//   .catch(error => {
//     console.error('Login error:', error);
//   });

// // Example for fetching data
// networkHandler.fetchData('/some/data/endpoint')
//   .then(data => {
//     console.log('Fetched data:', data);
//   })
//   .catch(error => {
//     console.error('Fetch data error:', error);
//   });
