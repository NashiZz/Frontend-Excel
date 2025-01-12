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

        setSuccessMessage('✅ ตรวจสอบข้อมูลเรียบร้อย ไม่มีข้อผิดพลาด');
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
            setErrors(["❌ เกิดข้อผิดพลาดในการอัปโหลดไฟล์"]);
        }
    }
};

