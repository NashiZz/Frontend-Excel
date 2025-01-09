import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrors([]);
        setSuccessMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setErrors(['กรุณาเลือกไฟล์ Excel']);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/excel/validate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccessMessage('✅ ตรวจสอบข้อมูลเรียบร้อย ไม่มีข้อผิดพลาด');
                setErrors([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data);
            } else {
                setErrors(['❌ เกิดข้อผิดพลาดในการอัปโหลดไฟล์']);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold text-center mb-4">📂 อัปโหลดไฟล์ Excel</h2>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer mb-4"
            />
            <button
                onClick={handleUpload}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                อัปโหลดไฟล์
            </button>

            {successMessage && (
                <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    {successMessage}
                </div>
            )}

            {errors.length > 0 && (
                <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <h4 className="font-bold mb-1">❌ พบข้อผิดพลาด:</h4>
                    <ul className="list-disc pl-5">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ExcelUpload;
