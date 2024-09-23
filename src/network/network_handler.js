import axios from "axios";

// export const host = "http://127.0.0.1:8000";
export const host = "https://objects.ummah-app.com";
const baseUrls = {
  landing: `${host}/landing/api`,
  masjid: `${host}/masjid/api`,
  madrasa: `${host}/madrasa/api`,
  faq: `${host}/faq/api`,
  root: host,
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

  async getSuperDashboard() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/getsuperdashboard"; // Relative to the 'landing' base URL

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

  async updateNamazTiming(namazData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/updatenamaztimings";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.post(url, namazData, {
        baseURL: baseUrls.masjid,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async rangeUpdateNamazTiming(namazData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/range-updatenamaztimings";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.post(url, namazData, {
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


  async getMasjidAdmin() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/getmasjid"; // Relative to the 'masjid' base URL

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      // Other headers from cURL can be omitted as Axios handles them automatically
    };

    try {
      const response = await this.axiosInstance.get(url, {
        baseURL: baseUrls.masjid,  // Override the default baseURL to 'masjid'
        headers
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async addMasjidAdmin(masjidData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey); // Get auth token
    const url = "/addmasjid"; // Relative to the 'masjid' base URL

    const headers = {
      Authorization: `Token ${authToken}`, // Use the retrieved auth token
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      // Other headers from cURL can be omitted as Axios handles them automatically
    };

    try {
      const response = await this.axiosInstance.post(url, masjidData, {
        baseURL: baseUrls.masjid, // Set the base URL for 'masjid' API
        headers,
      });
      return response.data;
    } catch (error) {
      throw error; // Handle errors using the interceptor
    }
  }

  async editMasjidAdmin(masjidData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/editmasjid";
    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
    try {
      const response = await this.axiosInstance.post(url, masjidData, {
        baseURL: baseUrls.masjid,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAccountsAdmin() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/get-accounts"; // Relative to the 'landing' base URL

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      // Other headers from cURL can be omitted as Axios handles them automatically
    };

    try {
      const response = await this.axiosInstance.get(url, { headers }); // No need to override baseURL for 'landing'
      return response.data;
    } catch (error) {
      throw error; // Handle errors using the interceptor
    }
  }

  async addAccountAdmin(data) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/add-account";

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resetAccountPasswordAdmin(password, accountId) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/reset-password";

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    const data = { password, account_id: accountId };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async addMadrasaAdmin(madrasaData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/add-madrasa"; // Relative to the 'landing' base URL

    const headers = {
      Authorization: `Token ${authToken}`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    try {
      const response = await this.axiosInstance.post(url, madrasaData, { headers });
      return response.data;
    } catch (error) {
      throw error; // Handle errors in the interceptor
    }
  }



  async getMadrasasAdmin() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/get-madrasas-init";

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




  async editMadrasaAdmin(madrasaData) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/edit-madrasa";

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


  async getCategoryAdmin(url) {
    const headers = {
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9,fi-FI;q=0.8,fi;q=0.7,sv-FI;q=0.6,sv;q=0.5,de;q=0.4",
      "Authorization": `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
    };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addCategoryAdmin(url, category, image) {
    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
      "Content-Type": "application/json",
    };

    const data = { category, image }; // Include the image data

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async editCategoryAdmin(url, categoryId, category, image) {
    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
      "Content-Type": "application/json",
    };

    const data = { id: categoryId, category, image };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async getPendingApprovalsAdmin(url) {
    const headers = {
      Accept: "application/json, text/plain, */*", // Standard for JSON responses
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`, // Crucial for authentication
    };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async approveApprovalsAdmin(url, id, approve) {
    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
      "Content-Type": "application/json",
    };

    const data = { id: id, approve: approve };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUmrahAndHajj() {
    const url = "/umrahandhajj/api/getall";

    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
    };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async addVendorAdmin(vendorData) {
    const url = "/umrahandhajj/api/addvendor";

    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
      "Content-Type": "application/json",
    };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, vendorData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getIslamicLearningData() {
    const url = "/IslamicLearning/api/getdata";

    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
      "Content-Type": "application/json",
    };


    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root, // Ensure the correct base URL for this API
      });

      const response = await axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addIslamicLearningCategory(categoryname) {
    const url = "/IslamicLearning/api/addcategory";

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
    };

    const data = { categoryname };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addIslamicLearningVideo(videoData) {
    const url = "/IslamicLearning/api/AddVideo";

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
    };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, videoData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteIslamicLearningVideo(videoId) {
    const url = `/IslamicLearning/api/delete/${videoId}`; // Use template literal to include videoId

    const headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: `Token ${localStorage.getItem(NetworkHandler.loginTokenKey)}`,
    };

    try {
      const axiosInstance = axios.create({
        baseURL: baseUrls.root,
      });
      const response = await axiosInstance.post(url, null, { headers }); // POST request with null data
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getFaqs() {
    const url = "/faq";
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
    try {
      const response = await this.axiosInstance.get(url, {
        baseURL: baseUrls.faq,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async addFaq(data) {
    const url = "/add";
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };
    try {
      const response = await this.axiosInstance.post(url, data, {
        baseURL: baseUrls.faq,
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSessions() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/sessions";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const data = ' getSessions';

    try {
      const response = await this.axiosInstance.get(url, { headers, data });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async getPrograms() {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/programs";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const data = ' getSessions';

    try {
      const response = await this.axiosInstance.get(url, { headers, data });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addProgram(madrasaId, name) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/programs";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      madrasa_id: madrasaId,
      name: name,
    };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async editProgram(madrasaId, programId, name) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/programs";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      madrasa_id: madrasaId,
      program_id: programId,
      name: name
    };

    try {
      const response = await this.axiosInstance.put(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async addSession(madrasaId, day, startTime, endTime, gender, teachers, name, program) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/sessions";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      madrasa_id: madrasaId,
      day: day,
      start_time: startTime,
      end_time: endTime,
      gender: gender,
      teachers: teachers,
      name: name,
      program_id: program,
    };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async editSession(madrasaId, day, startTime, endTime, gender, sessionId, teachers, name, program) {
    const authToken = localStorage.getItem(NetworkHandler.loginTokenKey);
    const url = "/ummah/sessions";

    const headers = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      madrasa_id: madrasaId,
      day: day,
      start_time: startTime,
      end_time: endTime,
      gender: gender,
      id: sessionId, // Include the session ID for updating
      teachers: teachers,
      name: name,
      program_id: program,
    };

    try {
      const response = await this.axiosInstance.put(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getFeesInit() {
    const url = `${baseUrls.madrasa}/fetch-monthly-fee/init`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getFees(madrasaId, programId, monthDate) {
    const url = `${baseUrls.madrasa}/fetch-monthly-fee`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"

    };

    const params = {
      madrasa_id: madrasaId,
      program_id: programId,
      month_date: monthDate
    };

    try {
      const response = await this.axiosInstance.get(url, { headers, params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async markFee(feeId, isPaid) {
    const url = `${baseUrls.madrasa}/fetch-monthly-fee`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    };

    const data = {
      fee_id: feeId,
      is_paid: isPaid
    };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async addMasjidEvent(eventDate, endDate, title, description, venue, show_attendance, recurrence) {
    const url = `${baseUrls.masjid}/masjid-events-admin`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`
    };

    const formData = new FormData();
    formData.append('event_date', eventDate);
    formData.append('title', title);
    formData.append('description', description);

    formData.append('end_date', endDate);
    formData.append('venue', venue);
    formData.append('recurrence', recurrence);
    formData.append('show_attendance', show_attendance);

    try {
      const response = await this.axiosInstance.post(url, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getIssues(masjidId) {
    const url = `${baseUrls.masjid}/get-issues/${masjidId}`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getMasjidEvent() {
    const url = `${baseUrls.masjid}/masjid-events-admin`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async editMasjidEvent(eventId, eventDate, endDate, title, description, venue, show_attendance, recurrence) {
    const url = `${baseUrls.masjid}/masjid-events-admin`; // Use the correct endpoint

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);

    const headers = {
      "Authorization": `Token ${token}`
    };

    const formData = new FormData();
    formData.append('event_date', eventDate);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('id', eventId);
    formData.append('end_date', endDate);
    formData.append('venue', venue);
    formData.append('show_attendance', show_attendance);
    formData.append('recurrence', recurrence);



    try {
      const response = await this.axiosInstance.put(url, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getHalalProducts() {
    const url = `${host}/halal/api/get-products`;
    const token = localStorage.getItem(NetworkHandler.loginTokenKey);
    const headers = {
      "Authorization": `Token ${token}`
    };

    try {
      const response = await this.axiosInstance.get(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async markHalalProducts(productId, isApproved) {
    const url = `${host}/halal/api/get-products`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);
    const headers = {
      "Authorization": `Token ${token}`
    };


    const data = {
      product_id: productId,
      is_approved: isApproved
    };

    try {
      const response = await this.axiosInstance.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async editHalalProduct(productId, isApproved, productName, halalStatus, fallbackImage, nutritionGrade) {
    const url = `${host}/halal/api/get-products`;
    const token = localStorage.getItem(NetworkHandler.loginTokenKey);
    const headers = {
      "Authorization": `Token ${token}`
    };

    const productData = {
      product_id: productId,
      is_approved: isApproved,
      product_name: productName,
      halal_status: halalStatus,
      fallback_image: fallbackImage,
      nutrition_grade: nutritionGrade,
    };

    try {
      const response = await this.axiosInstance.put(url, productData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addHalalProduct(productName, halalStatus, nutritionGrade, fallbackImage, barcode) {
    const url = `${host}/halal/api/get-products`;

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);
    const headers = {
      "Authorization": `Token ${token}`
    };
    const productData = {
      should_add: true,
      product_name: productName,
      halal_status: halalStatus,
      barcode: barcode,
      nutrition_grade: nutritionGrade,
      fallback_image: fallbackImage,
      barcode: barcode
    };

    try {
      const response = await this.axiosInstance.post(url, productData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadHalalProducts(file) {
    const url = `${host}/halal/api/upload_xlsx`; // Adjust if needed 

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);
    const headers = {
      "Authorization": `Token ${token}`
    };
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.axiosInstance.post(url, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async bulkUploadVideos(file) {
    const url = `${host}/IslamicLearning/api/bulk-upload`; // Adjust if needed 

    const token = localStorage.getItem(NetworkHandler.loginTokenKey);
    const headers = {
      "Authorization": `Token ${token}`
    };
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.axiosInstance.post(url, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default NetworkHandler;