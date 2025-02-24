import axios from 'axios';

const API_URL = "https://backend-excel-cagd.onrender.com/api/save/templates";

export const updateUserTokenInBackend = async (userToken) => {
  try {
    const response = await axios.post(`${API_URL}/update-token`, {
      userToken: userToken,
      templates: [] 
    });

    if (response && response.data) {
      console.log("User token updated successfully:", response.data);
      return response;
    }
  } catch (error) {
    console.error("❌ Error updating user token in backend:", error);
    throw error; 
  }
};

export const fetchTemplatesName = async (userToken) => {
  try {
      const response = await fetch(`${API_URL}/${userToken}`);
      if (!response.ok) {
          throw new Error('Failed to fetch templates');
      }
      return response.data;
  } catch (error) {
      console.error('Error fetching templates:', error);
  }
};

export const fetchTemplates = async (userToken) => {
  try {
    let response = await axios.get(`${API_URL}/${userToken}`);
    if (response.status === 404) {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      response = await axios.get(`${API_URL}/${userToken}`);
    }
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
