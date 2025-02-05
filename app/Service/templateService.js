import axios from 'axios';

const API_URL = "https://backend-excel-cagd.onrender.com/api/save/templates";

export const fetchTemplates = async (userToken) => {
  try {
    const response = await axios.get(`${API_URL}/${userToken}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    return null;
  }
};

export const deleteTemplate = async (userToken, templateName) => {
  try {
    const response = await axios.delete(`${API_URL}/${userToken}/${templateName}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting template:", error);
    return null;
  }
};

export const updateTemplate = async (userToken, templateName, templateRequest) => {
  try {
    const response = await axios.put(`${API_URL}/${userToken}/${templateName}`, templateRequest);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating template:", error);
    return null;
  }
};
