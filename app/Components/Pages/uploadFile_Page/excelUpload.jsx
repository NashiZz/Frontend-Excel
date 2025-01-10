import { uploadExcelFile } from '@/app/Service/dynamicService';
import React, { useState } from 'react';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true); 

        await uploadExcelFile(file, setErrors, setSuccessMessage);

        setIsLoading(false);  
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">📂 อัปโหลดไฟล์ Excel</h2>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer mb-4 p-2"
            />
            <button
                onClick={handleUpload}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300"
                disabled={isLoading} 
            >
                {isLoading ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'} 
            </button>

            {isLoading && (
                <div className="mt-4 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {successMessage && (
                <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
                    <div className="flex items-center">
                        <span className="text-2xl mr-2">✅</span>
                        <p>{successMessage}</p>
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
                    <h4 className="font-semibold text-lg mb-3 flex items-center">
                        <span className="text-xl mr-2">❌</span>
                        พบข้อผิดพลาด:
                    </h4>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2 text-left text-gray-600">ลำดับ</th>
                                    <th className="border px-4 py-2 text-left text-gray-600">ข้อผิดพลาด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errors.map((error, index) => (
                                    <tr key={index} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{error}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExcelUpload;
