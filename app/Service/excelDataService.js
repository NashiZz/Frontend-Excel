import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchExistingRecords = async (userToken, templateId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/checkExistingRecords?userToken=${userToken}&templateId=${templateId}`);
        const data = await response.json();
        return data.existingRecords || [];
    } catch (error) {
        console.error("Error fetching existing records:", error);
        throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
};

export const checkFileExists = async (userToken, templateId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/checkFileExists?templateId=${templateId}&userToken=${userToken}`);
        return await response.json();
    } catch (error) {
        console.error("Error checking file existence:", error);
        throw new Error("เกิดข้อผิดพลาดในการตรวจสอบไฟล์");
    }
};

export const saveExcelData = async (requestData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/saveExcelData`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) throw new Error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");

        return await response.json();
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
};

export const saveNewAndUpdateRecords = async (requestData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/saveNewUpdate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) throw new Error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");

        const data = await response.json(); 
        console.log("✅ Success:", data.message);
        return data;
    } catch (error) {
        console.error("❌ Error saving new and update records:", error);
        throw error;
    }
};

// ดึงรายการ Templates
export const fetchTemplateData = async (userToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/save/templates/${userToken}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { templates: [] };
  }
};

// ดึงไฟล์ที่อัปโหลด
export const fetchUploadedFiles = async (userToken, templateIDs) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/getUploadedFiles`, {
      userToken,
      templateIDs,
    });

    return response.data.files.map(file => file.file_details);
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    return [];
  }
};

// ดาวน์โหลดไฟล์ Excel
export const downloadExcelFile = async (userToken, fileName, templateId) => {
  try {
    const { templates } = await fetchTemplateData(userToken);

    const selectedTemplate = templates.find(template => template.template_id === templateId);
    if (!selectedTemplate) {
      console.error("ไม่พบ Template ที่ต้องการ");
      return;
    }

    const orderedHeaders = selectedTemplate.headers.map(header => header.name);

    const response = await axios.post(
      `${API_BASE_URL}/exportExcel`,
      { userToken, fileName, templateId, orderedHeaders },
      { responseType: "blob" } 
    );

    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const fileUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
