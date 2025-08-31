import axios from "axios";

const API_URL = "http://localhost:5001/api/contact";

export const sendMessage = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
