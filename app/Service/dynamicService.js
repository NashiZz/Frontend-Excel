import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const uploadExcelFile = async (file, setErrors, setSuccessMessage) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`${API_BASE_URL}/excel/dynamic`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        setSuccessMessage('ตรวจสอบข้อมูลเรียบร้อย ไม่มีข้อผิดพลาด');
        setErrors([]);
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (errorData.errors) {
                setErrors(errorData.errors);
            } else {
                setErrors([errorData.message || "เกิดข้อผิดพลาด"]);
            }
        } else {
            console.error("Error:", error.message);
            setErrors(["เกิดข้อผิดพลาดในการอัปโหลดไฟล์"]);
        }
    }
};

export const uploadExcelFileWithHeader = async (file, header, setErrors, setSuccessMessage) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("headers", header);

    try {
        const response = await axios.post(`${API_BASE_URL}/excel/headers`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        setSuccessMessage("ตรวจสอบข้อมูลเรียบร้อย ไม่มีข้อผิดพลาด");
        setErrors([]);
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (errorData.errors) {
                setErrors(errorData.errors);
            } else {
                setErrors([errorData.message || "เกิดข้อผิดพลาด"]);
            }
        } else {
            console.error("Error:", error.message);
            setErrors(["เกิดข้อผิดพลาดในการอัปโหลดไฟล์"]);
        }
    }
};

export const uploadExcelFileWithTemplate = async (file, condition, calculater, relation, compare, setErrors, setSuccessMessage, handleReviewPage, setShowErrorModal) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("condition", JSON.stringify(condition));
    formData.append("calculater", JSON.stringify(calculater));
    formData.append("relation", JSON.stringify(relation));
    formData.append("compare", JSON.stringify(compare));

    try {
        const response = await axios.post(`${API_BASE_URL}/excel/template`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            setSuccessMessage("อัปโหลดไฟล์สำเร็จ! ตรวจสอบข้อมูลเรียบร้อย ไม่มีข้อผิดพลาด");
            handleReviewPage();
        }
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (errorData.errors) {
                setErrors(errorData.errors);
                console.log(errorData.errors);
                
            } else {
                setErrors([errorData.message || "เกิดข้อผิดพลาด"]);
                console.log(errorData.message);
            }
        } else {
            console.error("Error:", error.message);
            setErrors(["❌ เกิดข้อผิดพลาดในการอัปโหลดไฟล์"]);
        }
        setShowErrorModal(true);
    }
};

