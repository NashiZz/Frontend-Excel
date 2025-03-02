import { uploadExcelFile, uploadExcelFileWithHeader, uploadExcelFileWithTemplate } from '@/app/Service/dynamicService';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { downloadErrorReport } from './excelErrorReport';
import { fetchTemplates } from '@/app/Service/templateService';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);
    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDialog, setIsLoadingDialog] = useState(false);
    const [uploadOption, setUploadOption] = useState('noTopic');
    const [selectedHeader, setSelectedHeader] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templates, setTemplates] = useState([]);
    const [maxRows, setMaxRows] = useState(null);
    const [condition, setCondition] = useState([]);

    useEffect(() => {
        const fetchTemplatesData = async () => {
            if (!userToken) {
                return;
            }
    
            try {
                const data = await fetchTemplates(userToken);
                
                if (data && data.templates) {
                    if (data.templates.length === 0) {
                        setTemplates([]);
                    } else {
                        setTemplates(data.templates);
                    }
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการโหลดเทมเพลต:", error);
    
                if (error.response) {
                    toast.error(`เกิดข้อผิดพลาด: ${error.response.status} - ${error.response.data.message}`);
                } else if (error.request) {
                    toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
                } else {
                    toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง");
                }
            }
        };
    
        fetchTemplatesData();
    }, [userToken]);    

    useEffect(() => {
        if (selectedTemplate) {
            const templateData = templates.find(template => template.templatename === selectedTemplate);
            if (templateData) {
                setMaxRows(templateData.maxRows);
                setCondition(templateData.headers.map(header => header.condition));
            }
        }
    }, [selectedTemplate, templates]);

    useEffect(() => {
        if (selectedTemplate) {
            setUploadOption('noTopic');
        }
    }, [selectedTemplate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setErrors([]);
        setSuccessMessage('');
        setHeaders([]);
        setRows([]);

        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop().toLowerCase();
            if (fileType !== 'xlsx' && fileType !== 'xls') {
                setErrors(['กรุณาเลือกไฟล์ Excel ที่มีนามสกุล .xlsx หรือ .xls']);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

                if (sheetData.length > 0) {
                    setHeaders(sheetData[0]);

                    const dataRows = sheetData.slice(1);

                    if (dataRows.length > 0) {
                        console.log('จำนวนแถวข้อมูล:', dataRows.length);

                        dataRows.forEach((row, rowIndex) => {
                            row.forEach((cell, cellIndex) => {
                                if (cell === '') {
                                    console.log(`ช่องว่างในแถว ${rowIndex + 2}, คอลัมน์ ${cellIndex}`);
                                }
                            });
                        });
                    }

                    setRows(dataRows);
                }
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setErrors(['กรุณาเลือกไฟล์ Excel']);
            return;
        }

        if (maxRows && rows.length > maxRows) {
            setErrors([`จำนวนแถวข้อมูลของ template ไม่สามารถเกิน ${maxRows} แถวได้`]);
            return;
        }

        setSuccessMessage("")
        setIsLoading(true);
        setIsLoadingDialog(true);

        try {
            await uploadExcelFile(file, setErrors, setSuccessMessage);
            toast.success('🎉 อัปโหลดไฟล์สำเร็จ!', { position: 'bottom-right', autoClose: 3000 });
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('❌ การอัปโหลดล้มเหลว!', { position: 'bottom-right', autoClose: 3000 });
        } finally {
            setIsLoading(false);
            setIsLoadingDialog(false);
        }
    };

    const handleUploadHeader = async () => {
        if (!file) {
            setErrors(['กรุณาเลือกไฟล์ Excel']);
            return;
        }

        if (uploadOption === 'withTopic' && !selectedHeader) {
            setErrors(['กรุณาเลือกหัวข้อที่ต้องการตรวจสอบ']);
            return;
        }

        if (maxRows && rows.length > maxRows) {
            setErrors([`จำนวนแถวข้อมูลไม่สามารถเกิน ${maxRows} แถวได้`]);
            return;
        }

        setSuccessMessage("")
        setIsLoading(true);
        setIsLoadingDialog(true);

        try {
            if (uploadOption === 'withTopic') {
                await uploadExcelFileWithHeader(file, selectedHeader, setErrors, setSuccessMessage);
            } else {
                await uploadExcelFile(file, setErrors, setSuccessMessage);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingDialog(false);
        }
    };

    const handleUploadWithTemplate = async () => {
        if (!file) {
            setErrors(['กรุณาเลือกไฟล์ Excel']);
            return;
        }

        if (maxRows && rows.length > maxRows) {
            setErrors([`จำนวนแถวข้อมูลไม่สามารถเกิน ${maxRows} แถวได้`]);
            return;
        }

        const selectedTemplateData = templates.find(template => template.templatename === selectedTemplate);

        if (!selectedTemplateData) {
            setErrors(['ไม่พบข้อมูลเทมเพลต']);
            return;
        }

        const conditions = selectedTemplateData.headers.map(header => header.condition);
        const templateNames = selectedTemplateData.headers.map(header => header.name);
        const calculations = selectedTemplateData.condition?.calculations || [];
        const relations = selectedTemplateData.condition?.relations || [];
        const compares = selectedTemplateData.condition?.compares || [];

        // const calculationDetails = calculations.map(calculation => [
        //     calculation.type,
        //     calculation.addend,
        //     calculation.operand,
        //     calculation.result
        // ]);

        const calculationDetails = calculations.map(calculation => [
            calculation.expression,
            calculation.result
        ]);     
        
        const compareDetails = compares.map(compare => [
            compare.type,
            compare.addend,
            compare.operand
        ]);

        const relationDetails = relations.map(relation => [
            relation.column1,
            relation.condition,
            relation.column2,
        ]);

        const lowercaseHeaders = headers.map(header => header.toLowerCase());
        const lowercaseTemplateNames = templateNames.map(name => name.toLowerCase());

        const missingHeaders = lowercaseTemplateNames.filter(name => !lowercaseHeaders.includes(name));

        if (headers.length !== conditions.length) {
            setErrors([`จำนวนคอลัมน์ในไฟล์ Excel ต้องเท่ากับจำนวนเงื่อนไขในเทมเพลต (${conditions.length} คอลัมน์)`]);
            return;
        }

        if (missingHeaders.length > 0) {
            setErrors([`ไม่พบคอลัมน์ในไฟล์ Excel ที่ตรงกับชื่อในเทมเพลต: ${missingHeaders.join(', ')}`]);
            return;
        }

        setSuccessMessage("");
        setIsLoading(true);
        setIsLoadingDialog(true);

        try {
            await uploadExcelFileWithTemplate(file, conditions, calculationDetails, relationDetails, compareDetails, setErrors, setSuccessMessage);
            toast.success('🎉 อัปโหลดไฟล์สำเร็จ!', { position: 'bottom-right', autoClose: 3000 });
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('❌ การอัปโหลดล้มเหลว!', { position: 'bottom-right', autoClose: 3000 });
        } finally {
            setIsLoading(false);
            setIsLoadingDialog(false);
        }
    };

    const handleDownloadErrorReport = () => {
        downloadErrorReport(errors, headers, rows);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-lg kanit-regular">
                {isLoadingDialog && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                            <h3 className="text-xl font-semibold mb-4">กำลังตรวจสอบข้อมูลในไฟล์...</h3>
                            <div className="w-10 h-10 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}

                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">📂 ตรวจสอบข้อมูลไฟล์ Excel</h2>

                <div className="mb-4">
                    <div className="flex flex-col column items-start mb-2">
                        <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">เลือกเทมเพลตที่ใช้ตรวจสอบ:</label>
                        <select
                            id="template"
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value || "")}
                            className="block w-full mt-1 text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 mb-2"
                        >
                            <option value="">-- เลือกเทมเพลต --</option>
                            {templates.map((template, index) => (
                                <option key={index} value={template.templatename}>
                                    {template.templatename}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedTemplate && condition.length > 0 && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {condition.map((cond, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {cond}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTemplate === "" && (
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
                                <label htmlFor="noTopic" className="text-sm text-gray-700">ส่งไฟล์ให้ตรวจสอบ</label>
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
                    )}
                </div>

                {uploadOption === 'withTopic' && (
                    <div className="mb-4">
                        <label htmlFor="header" className="block text-sm font-medium text-gray-700">
                            เลือกหัวข้อที่ต้องการตรวจสอบ:
                        </label>
                        <select
                            id="header"
                            value={selectedHeader}
                            onChange={(e) => setSelectedHeader(e.target.value)}
                            className="block w-full mt-1 text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        >
                            <option value="">-- เลือกหัวข้อ --</option>
                            {headers.map((header, index) => (
                                <option key={index} value={header}>
                                    {header}
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
                    onClick={selectedTemplate ? handleUploadWithTemplate : (uploadOption === 'withTopic' ? handleUploadHeader : handleUpload)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                </button>

                {errors.length > 0 ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center text-red-600">
                                <span className="text-2xl mr-2">❌</span>
                                พบข้อผิดพลาด:
                            </h4>

                            <div className="overflow-y-auto max-h-64">
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-gray-200 sticky top-0 z-10">
                                        <tr>
                                            <th className="border px-4 py-2 text-left text-gray-600">ลำดับ</th>
                                            <th className="border px-4 py-2 text-left text-gray-600">ข้อผิดพลาด</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {errors.map((error, index) => {
                                            if (typeof error === 'string') {
                                                return (
                                                    <tr key={index} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{index + 1}</td>
                                                        <td className="px-4 py-2">{error}</td>
                                                    </tr>
                                                );
                                            } else if (error.summary) {
                                                return error.errorDetails.map((detail, detailIndex) => (
                                                    <tr key={`${index}-${detailIndex}`} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{detailIndex + 1}</td>
                                                        <td className="px-4 py-2">{detail}</td>
                                                    </tr>
                                                ));
                                            }
                                        })}

                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={handleDownloadErrorReport}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                                >
                                    ดาวน์โหลดรายงานข้อผิดพลาด
                                </button>
                                <button
                                    onClick={() => setErrors([])}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                ) : successMessage && (
                    <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
                        <div className="flex items-center">
                            <p>{successMessage}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelUpload;
