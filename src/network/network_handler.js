const axios = require("axios");

const baseUrls = {
  landing: "https://objects.ummah-app.com/landing/api",
  masjid: "https://objects.ummah-app.com/masjid/api",
};

class NetworkHandler {
  static loginTokenKey = "ummahToken";

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: baseUrls.landing,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem(NetworkHandler.loginTokenKey);
          alert("Your session expired, please login again");
          window.location.reload();
        } else if (error.response && error.response.status === 500) {
          alert("Something went wrong, please try again later...");
        }
        return Promise.reject(error);
      }
    );
  }

  async login(username, password) {
    const url = "/login";

    const headers = {
      "Content-Type": "application/json",
    };
    const data = { username, password };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDashboard() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/get-dashboard";

    // Construct headers from the cURL example
    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getMasjidProfile() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/getmasjidview";

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.get(url, {
        baseURL: baseUrls.masjid,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async editMasjidProfile(profileData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/editmasjid"; 

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.post(url, profileData, {
        baseURL: baseUrls.masjid,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async sendAnnouncement(announcementText) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/sendnotification"; // Relative to the 'masjid' base URL

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    const data = { text: announcementText }; // Data for the announcement

    try {
      const response = await this.axiosInstance.post(url, data, {
        baseURL: baseUrls.masjid, // Override the default baseURL
        headers,
      });
      return response.data; 
    } catch (error) {
      throw error;
    }
  }

}

module.exports = NetworkHandler;

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