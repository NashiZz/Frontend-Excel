import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const CreateTemplate = () => {
    const [headers, setHeaders] = useState([{ name: "", condition: "" }]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fileName, setFileName] = useState("template");

    const handleHeaderChange = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const addHeader = () => {
        setHeaders([...headers, { name: "", condition: "" }]);
    };

    const removeHeader = (index) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    const validateHeaders = () => {
        for (let i = 0; i < headers.length; i++) {
            if (!headers[i].name.trim()) {
                alert(`กรุณากรอกชื่อ Header ในบรรทัดที่ ${i + 1}`);
                return false;
            }
            if (!headers[i].condition.trim()) {
                alert(`กรุณาเลือกเงื่อนไขในบรรทัดที่ ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateHeaders()) {
            setIsDialogOpen(true);
        }
    };

    const generateExcel = (headers, fileName) => {
        const headerNames = headers.map(header => header.name);

        const worksheetData = [
            headerNames,
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const handleDownload = () => {
        generateExcel(headers, fileName);
        setIsDialogOpen(false);
    };

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };

    return (
        <div className="container mx-auto p-6 pt-28">
            <h1 className="text-2xl font-bold mb-6">สร้างเทมเพลตใหม่</h1>
            <div className="flex gap-6">
                <div className="w-1/2">
                    <form onSubmit={handleSubmit}>
                        {headers.map((header, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-gray-700">ชื่อ Header</label>
                                    <button
                                        type="button"
                                        onClick={() => removeHeader(index)}
                                        className="text-red-500 text-xs"
                                    >
                                        ลบ
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2 mt-2"
                                    value={header.name}
                                    onChange={(e) => handleHeaderChange(index, 'name', e.target.value)}
                                    placeholder="กรอกชื่อ Header"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    ชื่อ Header จะถูกใช้เป็นชื่อคอลัมน์ในไฟล์ Excel
                                </p>

                                <label className="block text-sm font-medium text-gray-700 mt-4">เงื่อนไข</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 mt-2"
                                    value={header.condition}
                                    onChange={(e) => handleHeaderChange(index, 'condition', e.target.value)}
                                >
                                    <option value="">เลือกเงื่อนไข</option>
                                    <option value="name">ตรวจสอบชื่อ</option>
                                    <option value="email">ตรวจสอบอีเมล</option>
                                    <option value="phone">ตรวจสอบเบอร์โทร</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    เลือกเงื่อนไขที่ต้องการใช้ตรวจสอบค่าของคอลัมน์นี้
                                </p>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addHeader}
                            className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300"
                        >
                            เพิ่ม Header
                        </button>
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                บันทึก
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-1/2">
                    <h2 className="text-xl font-semibold mb-4">ตัวอย่างเทมเพลต</h2>
                    <div className="border border-gray-300 p-4 rounded-md">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index} className="border px-4 py-2">{header.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {headers.map((header, index) => (
                                        <td key={index} className="border px-4 py-2">{header.condition}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">ตั้งชื่อไฟล์</h3>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 mb-4"
                            value={fileName}
                            onChange={handleFileNameChange}
                            placeholder="กรุณากรอกชื่อไฟล์"
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsDialogOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                ดาวน์โหลดไฟล์
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTemplate;
