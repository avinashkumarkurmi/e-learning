import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { buyNow, fetchPopularCourses, fetchStudentEnrollment,addToCartToDataBase, removeFromCartToDataBase ,loginApi,signupApi,updateStudentProfile ,addToWishlistToDataBase, removeFromWishlistToDataBase } from "../../uitil/user";
import util from "util";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { log } from "console";

const initialState = {
  isLogin: false,
  userInfo: null, // { id, name, email, role }
  loading: false,
  error: null,
};


// Async thunk for login
export const login = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
  try {
    const data = await loginApi(userData);

    if (data) {
      // Store the full response object as a JSON string
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    }
    // console.log("Full login response data:", util.inspect(data, {depth: null, colors: true, maxArrayLength: null}));
    return data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error);
  }
});


export const signup = createAsyncThunk("user/signup", async (userData, { rejectWithValue }) => {
  try {
    const data = await signupApi(userData,"user");
    return data;
  } catch (error) { 
    return rejectWithValue(error);
  }
});



// Async thunk for adding item to wishlist
export const addItemToWishlist = createAsyncThunk(
  "user/addItemToWishlist", 
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      
      const data = await addToWishlistToDataBase(studentId, courseId);
      console.log("Full new wishlist response data:", util.inspect(data, {depth: null, colors: true, maxArrayLength: null}));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add course to wishlist");
    }
  }
);

export const removeItemFromWishlist = createAsyncThunk(
  "user/removeItemFromWishlist",
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      const data = await removeFromWishlistToDataBase(studentId, courseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove course from wishlist");
    }
  }
);


export const addItemToCart = createAsyncThunk(
  "user/addItemToCart", 
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      
      const data = await addToCartToDataBase(studentId, courseId);
      console.log("Full new wishlist response data:", util.inspect(data, {depth: null, colors: true, maxArrayLength: null}));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add course to wishlist");
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "user/removeItemFromCart",
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      const data = await removeFromCartToDataBase(studentId, courseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove course from wishlist");
    }
  }
);

export const upadateProfile = createAsyncThunk(
  "user/upadateProfile",
  async (profileObject, { rejectWithValue }) => {
    try {
      const data = await updateStudentProfile(profileObject);
      console.log(data);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove course from wishlist");
    }
  }
);

// Async thunk for enrolling in a course
export const enrollInCourse = createAsyncThunk("user/enroll", async ({ studentId, courseId,paymentId }, { dispatch, rejectWithValue }) => {
  try {
    const response = await buyNow(courseId, studentId,paymentId);
    // console.log(response,"30");
    
    // const updatedEnrollments = await fetchStudentEnrollment(studentId);
    // console.log(updatedEnrollments,"31");
    
    // dispatch(setEnrolledCourses(updatedEnrollments));
    return response ; // Return the enrolled course ID
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to enroll in course");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLogin = false;
    },
    setEnrolledCourses: (state, action) => {
      console.log(action.payload,"59");
      console.log(state.enrolledCourses,"60");
      // console.log(typeof state.enrolledCourse);
      state.enrolledCourses = action.payload; // Ensure this updates the store
    },
    setUser:(state, action) => {
      // console.log("action.payload",action.payload);
      state.isLogin = true;
      state.token = action.payload.token;
      state.userInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLogin = true;
        state.userInfo = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLogin = true;
        state.userInfo = action.payload;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Add enrollInCourse handling
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo.user.enrollments = action.payload
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })




      .addCase( addItemToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload
      })
      .addCase(addItemToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase( removeItemFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload
      })
      .addCase(removeItemFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase( addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase( removeItemFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(upadateProfile.pending, (state) => {

      })
      .addCase(upadateProfile.fulfilled, (state, action) => {
        // state.loading = false;

        
        if (action.payload.name) {
          state.userInfo.user.name = {
            ...state.userInfo.user.name, // ✅ Keep existing values
            ...action.payload.name, // ✅ Update only first & last
          };
        }
        
        // state.userInfo = action.payload
      })
      .addCase(upadateProfile.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload;
      })
  }
  
});

export const { logout, addToWishlist, removeFromWishlist, setEnrolledCourses,setUser } = userSlice.actions;
export default userSlice.reducer;
// export { enrollInCourse };
