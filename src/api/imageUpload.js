import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

/** Uploads an image file to a third-party hosting service. */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const { data } = await axios.post(UPLOAD_URL, formData);
    if (data.success) {
      return data.data.url;
    }
    throw new Error('Image upload failed at hosting service.');
  } catch (error) {
    // Consolidate error reporting
    const message = error.response?.data?.error?.message || error.message;
    throw new Error(`Image upload failed: ${message}`);
  }
};