import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://192.168.107.24:5001/";
 

// const BASE_URL = "http://192.168.225.24:5001/";
// import store from '../redux/store';


export const loginApi = async (userData,type) => {
  if(type=="instructor"){
    try {
      const response = await axios.post(`${BASE_URL}api/auth/Instructor/login`, userData); 
        
      return response.data; // { user: { id, name, email, role }, token: "..." }
    } catch (error) {
      console.log(error.message);
      
      throw error.response?.data?.message || "Login failed";
    }
  }
  try {
    const response = await axios.post(`${BASE_URL}api/auth/Student/login`, userData); 
      
    return response.data; // { user: { id, name, email, role }, token: "..." }
  } catch (error) {
    console.log(error);
    
    throw error.response?.data?.message || "Login failed";
  }
};

export const signupApi = async (userData,type) => {
  if(type=="instructor"){
    try {
      const response = await axios.post(`${BASE_URL}api/auth/Instructor/signup`, userData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Signup failed";
    }
  }
  else{
    try {
      
      const response = await axios.post(`${BASE_URL}api/auth/Student/signup`, userData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Signup failed";
    }
  }
};


export const generateCertificate = async (courseId, studentId) => {
  try {
    console.log("courseId, studentId");
    
    const response = await axios.post(`${BASE_URL}generateCertificate`, {
      courseId,
      studentId
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to generate certificate";
  }
};

export const getCertificateFromDatabase = async (courseId, studentId) => {

  
  try {
    const response = await axios.get(`${BASE_URL}getCertificate`, {
      params: {
        courseId,
        studentId
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to get certificate"; 
  }
};

        

export const getInstructorDetails = async (instructorId) => {
  try {
    const response = await axios.get(`${BASE_URL}instructors/${instructorId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to fetch instructor details";
  }
};

export const addToWishlistToDataBase = async (studentId, courseId) => {
  try {

    const response = await axios.post(`${BASE_URL}wishlist/add`, { studentId, courseId });
    console.log(response.data,"response.data");
    
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to add to wishlist";
  }
};

export const removeFromWishlistToDataBase = async (studentId, courseId) => {
  try {

    const response = await axios.post(`${BASE_URL}wishlist/remove`, { studentId, courseId });
    // console.log(response.data,"response.data2");
    return response.data;
  } catch (error) { 
    console.log(error);
    throw error.response?.data?.message || "Failed to remove from wishlist";
  }
};

export const addToCartToDataBase = async (studentId, courseId) => {
  try {
    console.log(studentId,"studentId",courseId,"courseId");
    
    const response = await axios.post(`${BASE_URL}cart/add`, { studentId, courseId });
    console.log(response.data,"response.data");
    
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to add to wishlist";
  }
};

export const removeFromCartToDataBase = async (studentId, courseId) => {
  try {

    const response = await axios.post(`${BASE_URL}cart/remove`, { studentId, courseId });
    // console.log(response.data,"response.data2");
    return response.data;
  } catch (error) { 
    console.log(error);
    throw error.response?.data?.message || "Failed to remove from wishlist";
  }
};


export const fetchName = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}name/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to fetch name";
  }
};




export const fetchPopularCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}popular`);
      
      return response.data; // { user: { id, name, email, role }, token: "..." }
    } catch (error) {
      console.log(error);
      
      throw error.response?.data?.message || "Login failed";
    }
  };
  
  export const fetchReactCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}react`);
      
      return response.data; // { user: { id, name, email, role }, token: "..." }
    } catch (error) {
      console.log(error);
      
      throw error.response?.data?.message || "Login failed";
    }
  };

  export const fetchJavaScriptCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}javascript`);
      
      return response.data; // { user: { id, name, email, role }, token: "..." }
    } catch (error) {
      console.log(error);
      
      throw error.response?.data?.message || "Login failed";
    }
  };

  export const fetchCourseDetail = async (courseId) => {
    // const state = store.getState(); 
    // const myValue = state.reducer.user;
    // console.log("myValue",myValue);
    
    try {
      const response = await axios.get(`${BASE_URL}course/${courseId}`);

      
      const data = JSON.parse(response.data);
      const d = data;
      return d; // { user: { id, name, email, role }, token: "..." }
    } catch (error) {
      console.log(error);
      
      throw error.response?.data?.message || "Login failed";
    }
  };


  export const searchTheRelatedCourse = async (searchText) => {
    try {
      const response = await axios.get(`${BASE_URL}search?search=${searchText}`);
      // const data = JSON.parse(response.data);
      
      return response.data; // { user: { id, name, email, role }, token: "..." }
    } catch (error) {
      console.log(error);
      
      throw error.response?.data?.message || "searched failed";
    }
  };

  export const fetchCourseProgress = async (courseId, studentId) => {
    try {
      const response = await axios.get(`${BASE_URL}getCourseProgress`, {
        params: { courseId, studentId }
      });
      return response.data.completionPercentage;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  

  export const markVideoAsWatchedToDb = async (videoId, courseId, studentId) => {
    try {
      const response = await axios.post(`${BASE_URL}markVideoAsWatched`, {
        videoId,
        courseId,
        studentId
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to mark video as watched";
    }
  };

  export const fetchMinCourseDetail = async (courses) => {

    try {
      
      // Sending an array of course objects to the backend
      const response = await axios.post(`${BASE_URL}minCourses`, {
        courses: courses // Array of course objects { courseid, coursetitle }
      });


      
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to fetch course details";
    }
  };



  export const fetchStudentInfo = async (studentId) => {
    try {
      const response = await axios.get(`${BASE_URL}api/users/s/student`, {
        params: {
          studentId: studentId
        }
      });
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to fetch student details";
    }
  };

  export const fetchInstructorInfo = async (instructorId) => {
    try {
      const response = await axios.get(`${BASE_URL}api/users/s/instructor`, {
        params: {
          instructorId: instructorId
        }
      });
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to fetch student details";
    }
  };

  export const uploadProfilePicture = async (type,id,profilePicture) => {
    console.log(type,id,profilePicture,"profilePicture");
    
    try {
      // Create form data to send image file
      const formData = new FormData();
      formData.append('type', type);
      formData.append('id', id);
      formData.append('profilePicture', {
        uri: profilePicture,
        type: 'image/jpeg',
        name: 'profile-picture.jpg'
      });
      
      const response = await axios.post(`${BASE_URL}uploadProfilePicture`, 
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to upload profile picture";
    }
  };


  export const updateStudentProfile = async (profileData) => {
    try {
      const response = await axios.put(`${BASE_URL}students/updateProfile`, profileData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      
      return response.data; // Return response data for further use
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error.response?.data?.message || "Failed to update profile";
    }
  };
  

  export const updateInstructorProfileToDb = async (profileData) => {
    try {
      const response = await axios.put(`${BASE_URL}instructors/updateProfile`, profileData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.data; // Return response data for further use
    } catch (error) {
      console.error("Error updating instructor profile:", error);
      throw error.response?.data?.message || "Failed to update profile";
    }
  };

export const updatePassword = async (currentPassword, newPassword, type, id) => {
  try {

    
    const response = await axios.get(`${BASE_URL}updatePassword`, {
      params: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        type: type,
        id: id
      }
    });
    
    return response.data; // Return the response data for further use
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Failed to fetch student enrollment";
  }
}

  export const fetchInstructorNumberOfStudentsEnrolled   = async (courseIds) => {
    try {
      const response = await axios.get(`${BASE_URL}getCourseEnrollmentCount`, {
        params: {
          courseIds: courseIds
        }
      });
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to fetch instructor number of students enrolled";
    }
  };

  export const buyNow = async (courseId, studentId,paymentId) => {
    try {
      const response = await axios.get(`${BASE_URL}api/users/buyNow`, 
        {params: {
          courseId: courseId,
          studentId: studentId,
          paymentId: paymentId
      }});
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to buy now";
    }
  };

  export const fetchListOfEnrollmentCount = async (courseIds) => {
    try {
      const response = await axios.get(`${BASE_URL}getListOfEnrollmentCount`, {
        params: {
          courseIds: courseIds
        }
      });
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to fetch list of enrollment count";
    }
  };


  export const fetchStudentEnrollment = async (id, type="student") => {
    try {
      const response = await axios.get(`${BASE_URL}api/users/s/enrollment`, {
        params: {
          id: id,
          type: type
        }
      });
      
      return response.data; // Return the response data for further use
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to fetch student enrollment";
    }
  };
