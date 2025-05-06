import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://localhost:8080/api/save/templates";

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
    console.error("Error updating user token in backend:", error);
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
    console.error("Error fetching templates:", error);
    return null;
  }
};

export const deleteTemplate = async (userToken, templateId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userToken}/${templateId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    return null;
  }
};

export const updateTemplate = async (userToken, templateId, templateRequest) => {
  try {
    const response = await axios.put(`${API_URL}/${userToken}/${templateId}`, templateRequest);
    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    return null;
  }
};

export const saveTemplate = async (fileName, headers, maxRows, calculationCondition, greaterLessCondition, relationCondition, setIsSaving, setIsDialogOpen, navigate) => {
  if (!fileName.trim()) {
      alert("กรุณากรอกชื่อ Template");
      return;
  }

  const userToken = localStorage.getItem("userToken"); 
  const templateId = uuidv4();
  const newTemplate = {
      userToken: userToken,
      template_id: templateId,
      templatename: fileName,
      headers: headers,
      maxRows: maxRows,
      condition: {
          calculations: calculationCondition || [],
          compares: greaterLessCondition || [],
          relations: relationCondition || []
      }
  };

  const existingTemplates = JSON.parse(localStorage.getItem("templates")) || [];
  existingTemplates.push(newTemplate);
  localStorage.setItem("templates", JSON.stringify(existingTemplates));

  console.log("Sending template:", newTemplate);
  setIsSaving(true);

  try {
      const response = await axios.post(API_URL, newTemplate);

      if (response.status === 200) {
          alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
          setIsDialogOpen(false);
          navigate("/template");
      } else {
          alert(`Error: ${response.data.message}`);
      }
  } catch (error) {
      console.error("❌ Error saving template:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  } finally {
      setIsSaving(false);
  }
};

export const duplicateTemplate = async (template, userToken, setTemplates, setCopying, setShowCopyDialog) => {
  const templateId = uuidv4();
  const newTemplate = {
    userToken: userToken,
    template_id: templateId,
    templatename: `${template.templatename}_copy`,
    headers: template.headers,
    maxRows: template.maxRows,
    condition: {
      calculations: template.condition?.calculations || [],
      compares: template.condition?.compares || [],
      relations: template.condition?.relations || []
    }
  };

  const existingTemplates = JSON.parse(localStorage.getItem("templates")) || [];
  existingTemplates.push(newTemplate);
  localStorage.setItem("templates", JSON.stringify(existingTemplates));

  setCopying(true);

  try {
    const response = await axios.post(API_URL, newTemplate);

    if (response.status === 200) {
      alert("คัดลอกและบันทึกข้อมูลเรียบร้อยแล้ว!");
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    } else {
      alert(`Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error saving duplicated template:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  } finally {
    setCopying(false);
    setShowCopyDialog(false);
  }
};
