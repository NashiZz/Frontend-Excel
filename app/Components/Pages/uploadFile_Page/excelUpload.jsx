import { uploadExcelFile, validateExcelFileWithHeaders } from '@/app/Service/dynamicService';
import React, { useState } from 'react';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadOption, setUploadOption] = useState('noTopic'); 
    const [selectedTopic, setSelectedTopic] = useState('');
    const topics = ['หัวข้อ A', 'หัวข้อ B', 'หัวข้อ C'];

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

    const handleUploadHeader = async () => {
        if (!file) {
            setErrors(['กรุณาเลือกไฟล์ Excel']);
            return;
        }

        if (uploadOption === 'withTopic' && !selectedTopic) {
            setErrors(['กรุณาเลือกหัวข้อที่ต้องการตรวจสอบ']);
            return;
        }

        setIsLoading(true);

        await validateExcelFileWithHeaders(
            file,
            setErrors,
            setSuccessMessage,
            uploadOption === 'withTopic' ? selectedTopic : null
        );

        setIsLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">📂 อัปโหลดไฟล์ Excel</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกการอัปโหลด:</label>
                <div className="flex items-center mb-2">
                    <input
                        type="radio"
                        id="noTopic"
                        name="uploadOption"
                        value="noTopic"
                        checked={uploadOption === 'noTopic'}
                        onChange={(e) => setUploadOption(e.target.value)}
                        className="mr-2"
                    />
                    <label htmlFor="noTopic" className="text-sm text-gray-700">ส่งไฟล์ให้ตรวจสอบเลย</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="withTopic"
                        name="uploadOption"
                        value="withTopic"
                        checked={uploadOption === 'withTopic'}
                        onChange={(e) => setUploadOption(e.target.value)}
                        className="mr-2"
                    />
                    <label htmlFor="withTopic" className="text-sm text-gray-700">เลือกหัวข้อก่อนตรวจสอบไฟล์</label>
                </div>
            </div>

            {uploadOption === 'withTopic' && (
                <div className="mb-4">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                        เลือกหัวข้อที่ต้องการตรวจสอบ:
                    </label>
                    <select
                        id="topic"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="block w-full mt-1 text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        <option value="">-- เลือกหัวข้อ --</option>
                        {topics.map((topic, index) => (
                            <option key={index} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
