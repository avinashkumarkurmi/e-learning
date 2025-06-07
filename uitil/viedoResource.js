import axios from "axios";
const util = require("util");

const BASE_URL = "http://192.168.107.24:5001/";

// const BASE_URL = "http://192.168.10.24:5001";
// const BASE_URL = "http://192.168.234.24:5001";

// const BASE_URL = "http://192.168.225.24:5001";

export const uploadFilesToServer = async (videoFile, resourceFiles,instructorInfo,demoCourse,type) => {
  
  
  if (!videoFile && resourceFiles.length === 0) {
    
    console.warn("No files to upload");
    return;
  }


  const formData = new FormData();

  if (videoFile) {
    formData.append("video", {
      uri: videoFile.uri,
      name: videoFile.name || "video.mp4",
      type: videoFile.mimeType || "video/mp4",
    });
  }

  if (resourceFiles) {
    resourceFiles.forEach((file, index) => {
      formData.append(`resource_${index}`, {
        uri: file.uri,
        name: file.name || `resource_${index}.jpg`,
        type: file.mimeType || "image/jpeg",
      });
    });
    
  }


  
  formData.append("instructorInfo",  JSON.stringify(instructorInfo));
formData.append("demoCourse", JSON.stringify(demoCourse));


  
  // console.log(formData);
  

  if(type == 'section upload'){
    try {
      const response = await axios.post(`${BASE_URL}/uploadVideosAndResources`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload Success:", response.data);
      return response.data; // Contains Cloudinary URLs
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  }
  if(type == 'introduction video or thumbnail upload'){
    try {
      const response = await axios.post(`${BASE_URL}/uploadIntroductionAndThumbnail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // console.log("Upload Success:", response.data);
      return response.data; // Contains Cloudinary URLs
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  }
};


export const uploadFullCourse = async (courseData, instructorId) => {
  console.log("Uploading course data:", JSON.stringify(courseData, null, 2));

  try {
    for (const item of courseData) {
      const course = item.course;
      console.log(`Uploading full course: ${course.title}`);

      // Prepare FormData
      const formData = new FormData();

      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price);
      formData.append("instructorId", instructorId);

      if (course.introductionVideoUrl) {
        formData.append("introductionVideo", {
          uri: course.introductionVideoUrl,
          name: "introduction.mp4",
          type: "video/mp4",
        });
      }

      if (course.courseThumbnail) {
        formData.append("courseThumbnail", {
          uri: course.courseThumbnail,
          name: "thumbnail.jpg",
          type: "image/jpeg",
        });
      }

      

      // Loop through sections
      course.sections.forEach((section, sectionIndex) => {
        formData.append(`sections[${sectionIndex}][sectionId]`, section.sectionId);
        formData.append(`sections[${sectionIndex}][sectionTitle]`, section.sectionTitle);
        formData.append(`sections[${sectionIndex}][sectionPriority]`, section.sectionPriority);
        console.log("2");
        // Loop through videos in each section
        section.videos.forEach((video, videoIndex) => {
          formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoId]`, video.videoId);
          formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoTitle]`, video.videoTitle);
          formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoPriority]`, video.videoPriority);

          if (video.videoUrl.startsWith("file://")) {
            formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoFile]`, {
              uri: video.videoUrl,
              name: `video_${videoIndex}.mp4`,
              type: "video/mp4",
            });
          }
          console.log("viedo:",util.inspect(video, { depth: null, colors: true }));
          // Loop through resources of each video
          video?.resourcesUrl?.forEach((resource, resourceIndex) => {

            console.log(resource,"resource");
            let mimeType = "application/octet-stream";
            
            if (resource) {
              const extension = resource.split('.').pop().toLowerCase();
              
              // फ़ाइल एक्सटेंशन के आधार पर माइम टाइप निर्धारित करें
              switch(extension) {
                case 'jpg':
                case 'jpeg':
                  mimeType = 'image/jpeg';
                  break;
                case 'png':
                  mimeType = 'image/png'; 
                  break;
                case 'pdf':
                  mimeType = 'application/pdf';
                  break;
                case 'doc':
                  mimeType = 'application/msword';
                  break;
                case 'docx':
                  mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                  break;
                case 'xls':
                  mimeType = 'application/vnd.ms-excel';
                  break;
                case 'xlsx':
                  mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                  break;
              }
            }
            formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resources][${resourceIndex}][mimeType]`, mimeType);
            formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resources][${resourceIndex}][name]`, resource.split('/').pop());

            if (resource?.startsWith("file://")) {
              formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resources][${resourceIndex}][file]`, {
                uri: resource,
                name: resource.split('/').pop(),
                type: mimeType,
              });
            }
          });
        });
      });


      console.log("Form Data:",util.inspect(formData, { depth: null, colors: true }));
      // Send request to backend
      const response = await fetch(`${BASE_URL}uploadFullCourse`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      

      console.log("Response:", response);
      
      const result = await response.json();

      console.log("Upload Response:",util.inspect(result, { depth: null, colors: true }));
      return result;
      // console.log("Upload Response:", result);
    }
  } catch (error) {
    console.error("Error uploading course:", error);
    if (error.stack) {
      const stackLines = error.stack.split("\n");
      const relevantLine = stackLines[1]; // Usually where the error originated
      console.log("Error occurred at:", relevantLine.trim());
    }
  }
};


export async function uploadUpdatedCourseData(updatedData, instructorId) {
  console.log("Uploading updated course data:", JSON.stringify(updatedData, null, 2));

  try {
      const course = updatedData.course;
      const formData = new FormData();

      formData.append("courseId", course.courseId);
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price);
      formData.append("instructorId", instructorId);

      if (course.introductionVideoUrl) {
          formData.append("introductionVideo", {
              uri: course.introductionVideoUrl,
              name: "introduction.mp4",
              type: "video/mp4",
          });
      }

      if (course.courseThumbnail) {
          formData.append("courseThumbnail", {
              uri: course.courseThumbnail,
              name: "thumbnail.jpg",
              type: "image/jpeg",
          });
      }

      
      
      course.sections.forEach((section, sectionIndex) => {
          formData.append(`sections[${sectionIndex}][sectionId]`, section.sectionId);
          formData.append(`sections[${sectionIndex}][sectionTitle]`, section.sectionTitle);
          formData.append(`sections[${sectionIndex}][sectionPriority]`, section.sectionPriority);

         
          
          section.videos.forEach((video, videoIndex) => {
              formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoId]`, video.videoId);
              formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoTitle]`, video.videoTitle);
              formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoPriority]`, video.videoPriority);

              if (video.videoUrl && video.videoUrl.startsWith("file://")) {
                  formData.append(`sections[${sectionIndex}][videos][${videoIndex}][videoFile]`, {
                      uri: video.videoUrl,
                      name: `video_${videoIndex}.mp4`,
                      type: "video/mp4",
                  });
              }

              
              if (video.resourceUri.every(uri => uri === null)) {
                formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resourceUri]`, null);
                console.warn(`All resources are null for videoId: ${video.videoId}`);
              }
            else{
              console.log("video.resourceUri",video.resourceUri);
              
              video.resourceUri.forEach((uri, resourceIndex) => {
                if (uri === null) return;
                
                console.log(uri,"uri");
                
                const fileName = uri.split('/').pop(); // Extract filename from path
                const mimeType = `image/${fileName.split('.').pop()}`; // Guess MIME type (assuming images)
            
                formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resources][${resourceIndex}][mimeType]`, mimeType);
                formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resources][${resourceIndex}][name]`, fileName);
                formData.append(`sections[${sectionIndex}][videos][${videoIndex}][resources][${resourceIndex}][file]`, {
                    uri,
                    name: fileName,
                    type: mimeType,
                });
            });
            
            }
          });
      });


      console.log("data sdfgfhbjnk :",util.inspect(formData, { depth: null, colors: true }));
      const response = await fetch(`${BASE_URL}updateFullCourse`, {
          method: "POST",
          body: formData,
          headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
          },
      });

      console.log(response,"response");
      
      const result = await response.json();
      return result;
  } catch (error) {
      console.error("Error uploading updated course data:", error);
  }
}

export const deleteResourceFromDB = async (file,instructorId) => {
  try {
    const response = await axios.post(`${BASE_URL}deleteResource`, {
      file: file,
      instructorId: instructorId,
    });

    console.log("Resource deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
}

export const deleteSectionFromDB = async (sectionId,instructorId) => {
  try {
    const response = await axios.post(`${BASE_URL}deleteSection`, {
      sectionId: sectionId,
      instructorId: instructorId,
    });

    console.log("Section deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting Section:", error);
    throw error;
  }
}
// export const updateFullCourse = async (courseData, instructorId) => {
//   console.log(courseData,"form util");
  

//   const response = await axios.get(`${BASE_URL}/course/${courseData[0].course.courseId}`);
//   const res = JSON.parse(response.data);
//   console.log(res.course,"res");

//   function deepCompare(obj1, obj2, path = '') {
//     if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
//         if (obj1 !== obj2) {
//             console.log(`Change detected at ${path}: ${obj1} -> ${obj2}`);
//         }
//         return;
//     }

//     const keys1 = Object.keys(obj1);
//     const keys2 = Object.keys(obj2);
//     const allKeys = new Set([...keys1, ...keys2]);

//     allKeys.forEach(key => {
//         const newPath = path ? `${path}.${key}` : key;
//         if (!(key in obj1)) {
//             console.log(`Key added at ${newPath}: ${obj2[key]}`);
//         } else if (!(key in obj2)) {
//             console.log(`Key removed at ${newPath}: ${obj1[key]}`);
//         } else {
//             deepCompare(obj1[key], obj2[key], newPath);
//         }
//     });
// }

// console.log(deepCompare(courseData[0],res));

// };