// import { createSlice } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { buyNow, fetchPopularCourses, fetchStudentEnrollment, loginApi, updateInstructorProfileToDb, signupApi } from "../../uitil/user";
import {createDemoCoures} from "../../uitil/createDemoCourse";
import { uploadFullCourse, uploadUpdatedCourseData,deleteResourceFromDB,deleteSectionFromDB } from "../../uitil/viedoResource";
import util from "util";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    isLogin: false,
    instructorInfo: null, // { id, name, email, role }
    loading: false,
    error: null,
    demoCourse: null,
  };
  


export const instructorlogin = createAsyncThunk("instructor/login", async (userData, { rejectWithValue }) => {
    try {
      
      const data = await loginApi(userData,"instructor");
       // Call the separate API function
      //  console.log(data,"data");
       if (data) {
        // Store the full response object as a JSON string
        await AsyncStorage.setItem('instructorData', JSON.stringify(data));
        console.log("data",data);
      }
       
      //  console.log("data init :",util.inspect(data, { depth: null, colors: true }));
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  });


  export const instructorSignup = createAsyncThunk("instructor/signup", async (userData, { rejectWithValue }) => {
    try {
      console.log("userData :",util.inspect(userData, { depth: null, colors: true }));
      const data = await signupApi(userData,"instructor");
       // Call the separate API function
      //  console.log("data init :",util.inspect(data, { depth: null, colors: true }));
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  });

// export const uploadContent = createAsyncThunk("instructor/uploadContent", async (videoFile, resourceFiles, { rejectWithValue }) => {
//   try {
    
//     const result = await uploadFilesToServer(videoFile, resourceFiles);
//      // Call the separate API function
//      console.log(result);
     
//     return result;
//   } catch (error) {
//     console.log(error);
//     return rejectWithValue(error);
//   }
// })

// export const createDemoCouresForUpload = createAsyncThunk("instructor/createDemoCouresForUpload", async ( instructorId, { rejectWithValue }) => {
//   try {
//     const result = await createDemoCoures(instructorId);
//     //  console.log(result);
//     return result;
//   } catch (error) {
//     console.log(error);
//     return rejectWithValue(error);
//   }
// })

export const updateInstructorProfile = createAsyncThunk(
  "instructor/updateInstructorProfile",
  async (profileObject, { rejectWithValue }) => {

    try {
      const result = await updateInstructorProfileToDb(profileObject);
      console.log(result);
      
      return result;
      
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to update instructor profile");
    }
  }
);


export const uploadAllToServer = createAsyncThunk(
  "instructor/uploadAllToServer",
  async ({ dataToBeUploaded, instructorId }, { rejectWithValue }) => {
    try {
      const result = await uploadFullCourse(dataToBeUploaded, instructorId);
    
      return result.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to upload course");
    }
  }
);

export const updateAllToServer = createAsyncThunk(
  "instructor/updateAllToServer",
  async ({ allDetailOfThisCourse,EditCourseData,  instructorId }, { rejectWithValue }) => {
    const oldCourse = EditCourseData;
    const newCourse = allDetailOfThisCourse;
    try {

      function deepCompare(newData, oldData) {
        if (typeof newData !== 'object' || typeof oldData !== 'object' || newData === null || oldData === null) {
            return newData !== oldData ? newData : null;
        }
    
        if (Array.isArray(newData) && Array.isArray(oldData)) {
            return newData.map((item, index) => deepCompare(item, oldData[index] || {}));
        }
    
        let result = {};
        let allKeys = new Set([...Object.keys(newData), ...Object.keys(oldData)]);
    
        allKeys.forEach(key => {
            let diff = deepCompare(newData[key], oldData[key]);
            result[key] = diff !== undefined ? diff : null;
        });
    
        // Ensure all mandatory IDs are included
        if ('courseId' in newData) {
            result.courseId = newData.courseId;
        }
        if ('sectionId' in newData) {
            result.sectionId = newData.sectionId;
        }
        if ('videoId' in newData) {
            result.videoId = newData.videoId;
        }
    
        return result;
    }

    const diff = deepCompare(newCourse, oldCourse);
    console.log("diff :", util.inspect(diff, { depth: null, colors: true }));
    
    const result = await uploadUpdatedCourseData(diff, instructorId);

    
      return result.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to upload course");
    }
  }
);


export const deleteResource = createAsyncThunk(
  "instructor/deleteResource",
  async ({ file,instructorId }, { rejectWithValue }) => {
    try {
      const result = await deleteResourceFromDB(file,instructorId);

      return result.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to delete resource");
    }
  }
);


export const updateInstructorProfilePicatureUrl  = createAsyncThunk(
  "instructor/updateInstructorProfilePicatureUrl ",
  async (obj, { rejectWithValue }) => {
    try {
      // const result = await deleteSectionFromDB(sectionId,instructorId);
      return obj;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to delete resource");
    }
  }
);

export const deleteSection = createAsyncThunk(
  "instructor/deleteSection",
  async ({ sectionId,instructorId }, { rejectWithValue }) => {
    try {
      const result = await deleteSectionFromDB(sectionId,instructorId);

      return result.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || "Failed to delete resource");
    }
  }
);

const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    logoutInstructor: (state) => {state.isLogin= false},
    loginInstructor: (state, action) => {
      state.isLogin = true;
      state.instructorInfo = action.payload;
    },
    setNewData: (state, action) =>{
      state.instructorInfo = action.payload;
    },
    setUser:(state, action) => {
      // console.log("action.payload",action.payload);
      state.isLogin = true;
      state.token = action.payload.token;
      state.instructorInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(instructorlogin.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(instructorlogin.fulfilled, (state, action) => {
          state.isLogin = true;
          state.instructorInfo = action.payload;
          state.loading = false;
          
        })
        .addCase(instructorlogin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        
        .addCase(instructorSignup.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(instructorSignup.fulfilled, (state, action) => {
          state.isLogin = true;
          state.instructorInfo = action.payload;
          state.loading = false;
          
        })
        .addCase(instructorSignup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(uploadAllToServer.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(uploadAllToServer.fulfilled, (state, action) => {
            state.isLogin = true;
            state.instructorInfo = action.payload;
            state.loading = false;

        })
        .addCase(uploadAllToServer.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(updateAllToServer.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateAllToServer.fulfilled, (state, action) => {
            state.isLogin = true;
            state.instructorInfo = action.payload;
            state.loading = false;
        })
        .addCase(updateAllToServer.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })


        .addCase(deleteResource.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteResource.fulfilled, (state, action) => {
            state.isLogin = true;
            state.instructorInfo = action.payload;
            state.loading = false;
        })
        .addCase(deleteResource.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })


        .addCase(deleteSection.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteSection.fulfilled, (state, action) => {
            state.isLogin = true;
            state.instructorInfo = action.payload;
            state.loading = false;
        })
        .addCase(deleteSection.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        

        .addCase(updateInstructorProfile.pending, (state) => {
          // state.loading = true;
          state.error = null;
        })
        .addCase(updateInstructorProfile.fulfilled, (state, action) => {

          if (action.payload.updatedData.instructor) {
            state.instructorInfo.user.instructor.info = {
              ...state.instructorInfo.user.instructor.info, // ✅ Keep existing values
              ...action.payload.updatedData.instructor, // ✅ Update only first & last
            };
          }
          if (action.payload.updatedData.name) {
            state.instructorInfo.user.instructor.name = {
              ...state.instructorInfo.user.instructor.name, // ✅ Keep existing values
              ...action.payload.updatedData.name, // ✅ Update only first & last
            };
          }

        })
        .addCase(updateInstructorProfile.rejected, (state, action) => {
          // state.loading = false;
          state.error = action.payload;
        })


        .addCase(updateInstructorProfilePicatureUrl.pending, (state) => {
          // state.loading = true;
          state.error = null;
        })
        .addCase(updateInstructorProfilePicatureUrl.fulfilled, (state, action) => {
          if (action.payload.profilepictureurl) {  // Ensure correct key
            state.instructorInfo.user.instructor.info = {
              ...state.instructorInfo.user.instructor.info, // Keep existing values
              profilepictureurl: action.payload.profilepictureurl, // Update only profile picture URL
            };
          }
        })
        .addCase(updateInstructorProfilePicatureUrl.rejected, (state, action) => {
          // state.loading = false;
          state.error = action.payload;
        })

    }
});

export const { loginInstructor, logoutInstructor, setNewData,setUser } = instructorSlice.actions;
export default instructorSlice.reducer;
