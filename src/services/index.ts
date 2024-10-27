import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

const axiosInstance = axios.create({
  baseURL: UNSPLASH_API_URL,
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
  },
});

export const getPhotos = async (page = 1, perPage = 20) => {
  try {
    const response = await axiosInstance.get('/photos', {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

export const getPhotoDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/photos/${id}`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching photo details:', error);
    throw error;
  }
};
