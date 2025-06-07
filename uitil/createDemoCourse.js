import axios from "axios";

// const BASE_URL = "http://192.168.10.24:5001";
// const BASE_URL = "http://192.168.234.24:5001/";

const BASE_URL = "http://192.168.225.24:5001/";

export const createDemoCoures = async (InstructorId)=>{
    
        try {
            const response = await axios.post(`${BASE_URL}/createDemoCourse`, {
                instructorId: InstructorId,  
              });
          
          return response.data; // { user: { id, name, email, role }, token: "..." }
        } catch (error) {
          console.log(error);
          
          throw error.response?.data?.message || "demo course creation failed line 13";
        }
};