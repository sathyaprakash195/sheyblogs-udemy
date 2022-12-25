import { axiosInstance } from ".";

// Add a new blog
export const AddNewBlog = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/blogs/add-blog", payload);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// Get all blogs
export const GetAllBlogs = async () => {
  try {
    const response = await axiosInstance.get("/api/blogs/get-all-blogs");
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// Get blog by id
export const GetBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/blogs/get-blog-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// Update blog
export const UpdateBlog = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `/api/blogs/update-blog/${payload._id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// delete blog
export const DeleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/blogs/delete-blog/${id}`);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// get all blogs by user
export const GetAllBlogsByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/blogs/get-all-blogs-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all blogs by liked by user;
export const GetAllBlogsByLikedByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/blogs/get-all-blogs-by-liked-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all blogs by commented by user
export const GetAllBlogsByCommentedByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/blogs/get-all-blogs-by-commented-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all blogs by shared by user
export const GetAllBlogsBySharedByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/blogs/get-all-blogs-by-shared-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all blogs by shared to user
export const GetAllBlogsBySharedToUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/blogs/get-all-blogs-by-shared-to-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}