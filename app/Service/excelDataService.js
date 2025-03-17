import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchExistingRecords = async (userToken, selectedTemplate, templates, setData) => {
    const selectedTemplateData = templates.find(template => template.templatename === selectedTemplate);
    
    try {
        const response = await axios.get(`${API_BASE_URL}/checkExistingRecords`, {
            params: { userToken, templateId: selectedTemplateData.template_id }
        });
        
        if (response.data.existingRecords) {
            setData(response.data.existingRecords);
            return response.data.existingRecords;
        } else {
            setData([]);
            return [];
        }
    } catch (error) {
        console.error('Error fetching existing records:', error);
        throw error;
    }
};

export const saveToBackend = async (userToken, selectedTemplate, templates, headers, reviewData, errors, setIsReviewOpen, setErrors, newDatas) => {
    const selectedTemplateData = templates.find(template => template.templatename === selectedTemplate);
    if (!selectedTemplateData) throw new Error("ไม่พบข้อมูลเทมเพลตที่เลือก");

    const now = new Date().toISOString();
    const invalidRows = new Set();
    
    if (errors?.length > 0 && errors[0].errorList) {
        errors[0].errorList.forEach(error => invalidRows.add(error.row - 1));
    }

    const validRows = reviewData.filter((row, index) => !invalidRows.has(index));
    if (validRows.length === 0) throw new Error("ไม่มีข้อมูลที่ผ่านการตรวจสอบความถูกต้อง");

    try {
        const checkResponse = await axios.get(`${API_BASE_URL}/checkFileExists`, {
            params: { templateId: selectedTemplateData.template_id, userToken }
        });

        const { exists, fileName: existingFileName } = checkResponse.data;
        let fileNameToSave = exists ? existingFileName : prompt("กรุณากรอกชื่อไฟล์ที่ต้องการบันทึก:");
        if (!fileNameToSave) throw new Error("ต้องระบุชื่อไฟล์ก่อนบันทึก");

        const formattedRecords = (exists ? newDatas : validRows).map(row => {
            let record = {};
            headers.forEach(header => record[header] = row[header] ?? "");
            return record;
        });

        if (formattedRecords.length === 0) throw new Error("ไม่มีข้อมูลใหม่ให้เพิ่ม");

        await axios.post(`${API_BASE_URL}/saveExcelData`, {
            userToken,
            templateId: selectedTemplateData.template_id,
            fileName: fileNameToSave,
            uploadedAt: now,
            updateAt: now,
            records: formattedRecords
        });

        setIsReviewOpen(false);
        setErrors([]);
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
};

export const saveNewAndUpdateRecords = async (userToken, selectedTemplate, templates, headers, newDatas, updateDatas, setIsReviewOpen) => {
    const selectedTemplateData = templates.find(template => template.templatename === selectedTemplate);
    if (!selectedTemplateData) throw new Error("ไม่พบข้อมูลเทมเพลตที่เลือก");

    const now = new Date().toISOString();

    const formattedNewRecords = newDatas.map(row => {
        let record = {};
        headers.forEach(header => record[header] = row[header] ?? "");
        return record;
    });

    const formattedUpdatedRecords = updateDatas.map(row => {
        let record = {};
        headers.forEach(header => record[header] = row[header] ?? "");
        if (row.documentId) record.documentId = row.documentId;
        return record;
    });

    try {
        await axios.post(`${API_BASE_URL}/saveNewUpdate`, {
            userToken,
            templateId: selectedTemplateData.template_id,
            updateAt: now,
            records: [...formattedNewRecords, ...formattedUpdatedRecords]
        });
        setIsReviewOpen(false);
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
};
