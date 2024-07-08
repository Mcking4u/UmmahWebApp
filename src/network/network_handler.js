import axios from "axios";

const host = "http://127.0.0.1:8000";
// const host = "https://objects.ummah-app.com";
const baseUrls = {
  landing: `${host}/landing/api`,
  masjid: `${host}/masjid/api`,
};

class NetworkHandler {
  static loginTokenKey = "ummahToken";
  static loginResponseKey = "loginResponseKey";

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: baseUrls.landing,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem(NetworkHandler.loginTokenKey);
          // alert("Either your session expired or you dont have sufficient permissions to view this page, please login again");
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

  async getAnnouncements() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/sendnotification"; 

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


  async getUser() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/getuser"; // Note: This is relative to the 'ummah' base URL

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      // ... (other headers from cURL can be omitted as Axios handles them)
    };

    try {
      const response = await this.axiosInstance.get(url, { headers }); // No need to override baseURL for 'ummah'
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async uploadSalahTimings(formData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/namaztim_upload"; 

    const headers = {
      Authorization: `Token ${authToken}`,
      'Content-Type': 'multipart/form-data',
    };

    try {
      const response = await this.axiosInstance.post(url, formData, {
        baseURL: baseUrls.masjid,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getMadrasas() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/get-madrasas-init"; 

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addMadrasa(madrasaData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/add-madrasa";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, madrasaData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  


  async editMadrasa(madrasaData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/edit-madrasa";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, madrasaData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  


  async getTeachers() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/get-teachers"; 

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async editTeacher(teacherId, teacherData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = `/ummah/editteacher/${teacherId}`;
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, teacherData, { headers });
      return response.data;
    } catch (error) {
      throw error; 
    }
  }

  
  async addTeacher(teacherData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/add-teacher";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, teacherData, { headers });
      return response.data;
    } catch (error) {
      throw error; 
    }
  }

  async getMadrasaAnnouncements() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/get-announcements"; 

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async addMadrasaAnnouncement(announcementData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/add-announcement";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, announcementData, { headers });
      return response.data;
    } catch (error) {
      throw error; 
    }
  }
  async getMadrasaEnrollments() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/get-enrollments";

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  
  async assignTeacher(assignmentData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/assign-teacher";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, assignmentData, { headers });
      return response.data;
    } catch (error) {
      throw error; 
    }
  }

  
  async rejectEnrollment(rejectionData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/reject";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
  
    try {
      const response = await this.axiosInstance.post(url, rejectionData, { headers });
      return response.data;
    } catch (error) {
      throw error; 
    }
  }
  async getAssignedStudents() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/get-mapping";
  
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
    };
  
    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
    
  

}

export default NetworkHandler;