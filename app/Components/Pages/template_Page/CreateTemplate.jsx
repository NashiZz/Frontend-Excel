import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFileAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CreateTemplate = () => {
    const navigate = useNavigate();
    const [headers, setHeaders] = useState([{ name: "", condition: "" }]);
    const [expandedHeader, setExpandedHeader] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDowloadDialogOpen, setIsDowloadDialogOpen] = useState(false);
    const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
    const [isCalculationDialogOpen, setIsCalculationDialogOpen] = useState(false);
    const [isGreaterLessThanDialogOpen, setIsGreaterLessThanDialogOpen] = useState(false);
    const [isColumnConditionDialogOpen, setIsColumnConditionDialogOpen] = useState(false);
    const [fileName, setFileName] = useState("template");
    const [maxRows, setMaxRows] = useState(10);
    const [calculationType, setCalculationType] = useState('');
    const [compareType, setCompareType] = useState('');
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [calculationCondition, setCalculationCondition] = useState([]);
    const [greaterLessCondition, setGreaterLessCondition] = useState([]);
    const [relationCondition, setRelationCondition] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFirstColumn, setSelectedFirstColumn] = useState('');
    const [selectedSecondColumn, setSelectedSecondColumn] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [file, setFile] = useState(null);

    const conditions = [
        { value: "name", label: "ตรวจสอบชื่อ" },
        { value: "email", label: "ตรวจสอบอีเมล" },
        { value: "phone", label: "ตรวจสอบเบอร์โทร" },
        { value: "address", label: "ตรวจสอบที่อยู่" },
        { value: "provice", label: "ตรวจสอบจังหวัด" },
        { value: "district", label: "ตรวจสอบทอำเภอ" },
        { value: "citizenid", label: "ตรวจสอบบัตรประชาชน" },
        { value: "age", label: "ตรวจสอบอายุ" },
        { value: "gender", label: "ตรวจสอบเพศ" },
        { value: "balance", label: "ตรวจสอบเกี่ยวกับการเงิน" },
    ];

    const conditionOptions = [
        { label: 'ต้องมีข้อมูล', value: 'notEmpty' },
        { label: 'ต้องมีค่าตาม Column ที่1', value: 'exists' },
    ];

    const getUserToken = () => {
        let token = localStorage.getItem("userToken");
        return token;
    };

    const saveToLocalStorage = async () => {
        if (!fileName.trim()) {
            alert("กรุณากรอกชื่อ Template");
            return;
        }

        const userToken = getUserToken();
        const newTemplate = {
            userToken: userToken,
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
            const response = await fetch("https://backend-excel-cagd.onrender.com/api/save/templates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTemplate),
            });
            const data = await response.json();
            if (response.ok) {
                alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
                setIsDialogOpen(false);
                navigate("/template");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error saving template:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSelectOption = (option) => {
        setIsOptionDialogOpen(false);
        if (option === "calculation") {
            setIsCalculationDialogOpen(true);
        } else if (option === "greaterless") {
            setIsGreaterLessThanDialogOpen(true);
        } else if (option === "column-condition") {
            setIsColumnConditionDialogOpen(true);
        }
    };

    const addCondition = () => {
        if (!calculationType || !selectedColumns.addend || !selectedColumns.operand || !selectedColumns.result) {
            alert("กรุณากรอกค่าทั้งหมด");
            return;
        }

        const newCalculation = {
            type: calculationType,
            addend: selectedColumns.addend,
            operand: selectedColumns.operand,
            result: selectedColumns.result
        };

        const isDuplicate = calculationCondition.some(
            condition =>
                condition.addend === newCalculation.addend &&
                condition.type === newCalculation.type &&
                condition.operand === newCalculation.operand &&
                condition.result === newCalculation.result
        );

        if (isDuplicate) {
            alert("เงื่อนไขนี้ถูกเพิ่มไปแล้ว");
            return;
        }

        setCalculationCondition(prevCalculations => [...prevCalculations, newCalculation]);

        setCalculationType('');
        setSelectedColumns({
            addend: '',
            operand: '',
            result: ''
        });
    };

    const addGreaterLessCondition = () => {
        if (!compareType || !selectedColumns.addend || !selectedColumns.operand) {
            alert("กรุณากรอกค่าทั้งหมด");
            return;
        }

        const newGreaterLess = {
            type: compareType,
            addend: selectedColumns.addend,
            operand: selectedColumns.operand,
        };

        const isDuplicate = greaterLessCondition.some(
            condition =>
                condition.addend === newGreaterLess.addend &&
                condition.type === newGreaterLess.type &&
                condition.operand === newGreaterLessn.operand
        );

        if (isDuplicate) {
            alert("เงื่อนไขนี้ถูกเพิ่มไปแล้ว");
            return;
        }

        setGreaterLessCondition(prevGreaterLess => [...prevGreaterLess, newGreaterLess]);

        setCompareType('');
        setSelectedColumns({
            addend: '',
            operand: '',
        });
    };

    const handleFirstColumnChange = (e) => {
        setSelectedFirstColumn(e.target.value);
        if (e.target.value === selectedSecondColumn) {
            setSelectedSecondColumn("");
        }
    };

    const handleSecondColumnChange = (e) => {
        setSelectedSecondColumn(e.target.value);
        if (e.target.value === selectedFirstColumn) {
            setSelectedFirstColumn("");
        }
    };

    const handleConditionChange = (e) => {
        setSelectedCondition(e.target.value);
    };

    const addColumnCondition = () => {
        if (!selectedFirstColumn || !selectedSecondColumn || !selectedCondition) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (selectedFirstColumn === selectedSecondColumn) {
            alert("ไม่สามารถเลือกคอลัมน์เดียวกันได้");
            return;
        }

        const newCondition = {
            column1: selectedFirstColumn,
            condition: selectedCondition,
            column2: selectedSecondColumn,
        };

        setRelationCondition(prevConditions => [...prevConditions, newCondition]);

        setSelectedFirstColumn('');
        setSelectedSecondColumn('');
        setSelectedCondition('');
    };

    const addHeader = () => {
        setHeaders([...headers, { name: "", condition: "" }]);
        setExpandedHeader(headers.length);
    };

    const removeHeader = (index) => {
        setHeaders(headers.filter((_, i) => i !== index));
        if (expandedHeader === index) {
            setExpandedHeader(null);
        }
    };

    const handleHeaderChange = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const openOptionDialog = (header) => {
        setSelectedHeader(header);
        setIsOptionDialogOpen(true);
    };

    const closeOptionDialog = () => {
        setIsCalculationDialogOpen(false);
        setSelectedHeader(null);
    };

    const handleCalculationTypeChange = (e) => {
        setCalculationType(e.target.value);
    };

    const handleCompareTypeChange = (e) => {
        setCompareType(e.target.value);
    };

    const removeCondition = (index) => {
        const updatedConditions = calculationCondition.filter((_, i) => i !== index);
        setCalculationCondition(updatedConditions);
    };

    const removeCompare = (index) => {
        const updatedConditions = greaterLessCondition.filter((_, i) => i !== index);
        setGreaterLessCondition(updatedConditions);
    };

    const removeRelation = (index) => {
        const updatedConditions = relationCondition.filter((_, i) => i !== index);
        setRelationCondition(updatedConditions);
    };

    const handleColumnSelect = (columnName, columnType) => {
        if (
            (columnType === 'addend' && (selectedColumns.operand === columnName || selectedColumns.result === columnName)) ||
            (columnType === 'operand' && (selectedColumns.addend === columnName || selectedColumns.result === columnName)) ||
            (columnType === 'result' && (selectedColumns.addend === columnName || selectedColumns.operand === columnName))
        ) {
            return;
        }

        setSelectedColumns((prevState) => ({
            ...prevState,
            [columnType]: prevState[columnType] === columnName ? null : columnName,
        }));
    };

    const handleGraterColumnSelect = (columnName, columnType) => {
        if (
            (columnType === 'addend' && (selectedColumns.operand === columnName || selectedColumns.result === columnName)) ||
            (columnType === 'operand' && (selectedColumns.addend === columnName || selectedColumns.result === columnName))
        ) {
            return;
        }

        setSelectedColumns((prevState) => ({
            ...prevState,
            [columnType]: prevState[columnType] === columnName ? null : columnName,
        }));
    };

    const validateHeaders = () => {
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];

            if (!header.name.trim()) {
                alert(`กรุณากรอกชื่อ Header ในบรรทัดที่ ${i + 1}`);
                return false;
            }
            if (!header.condition.trim()) {
                alert(`กรุณาเลือกเงื่อนไขในบรรทัดที่ ${i + 1}`);
                return false;
            }

            const duplicate = headers.filter(h => h.name === header.name).length > 1;
            if (duplicate) {
                alert(`ชื่อ Header ในบรรทัดที่ ${i + 1} ซ้ำกัน`);
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
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryString = event.target.result;
            const workbook = XLSX.read(binaryString, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const newHeaders = jsonData[0].map((header) => ({ name: header, condition: "" }));
            setHeaders(newHeaders);
        };
        reader.readAsBinaryString(file);
        setFile(file);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setHeaders([]);
        document.getElementById('file-upload').value = '';
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
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/template")}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    กลับ
                </button>
                <h1 className="text-3xl font-bold text-gray-800 ml-12">สร้างเทมเพลตใหม่</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-blue-500 w-6 h-6" />
                        เพิ่มหัวข้อคอลัมน์
                    </h2>
                    <div className="bg-white p-6 mb-6 rounded-lg shadow-lg border border-gray-200">
                        <label htmlFor="file-upload" className="block text-lg font-semibold text-gray-700 mb-2">
                            เพิ่มหัวข้อคอลัมน์จากไฟล์ Excel
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-4"
                            />
                            {file && (
                                <label
                                    onClick={handleRemoveFile}
                                    className="cursor-pointer text-red-500 hover:text-red-600"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="w-5 h-5" />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            กรุณาเลือกไฟล์ Excel ที่ต้องการอัพโหลด
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {headers.map((header, index) => (
                            <div key={index} className="mb-4">
                                {expandedHeader !== index && header.name && header.condition ? (
                                    <button
                                        type="button"
                                        className="w-full text-left px-4 py-2 bg-white border rounded-md shadow-md hover:bg-gray-100 transition flex items-center gap-3"
                                        onClick={() => setExpandedHeader(index)}
                                    >
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <span>{header.name}</span>
                                    </button>
                                ) : (
                                    <div className="bg-white p-4 border rounded-md shadow-md">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium text-gray-700">
                                                ชื่อ Header
                                            </label>
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
                                            onChange={(e) =>
                                                handleHeaderChange(index, "name", e.target.value)
                                            }
                                            placeholder="กรอกชื่อ Header"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            ชื่อ Header จะถูกใช้เป็นชื่อคอลัมน์ในไฟล์ Excel
                                        </p>

                                        <label className="block text-sm font-medium text-gray-700 mt-4">
                                            เงื่อนไข
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-md p-2 mt-2"
                                            value={header.condition}
                                            onChange={(e) =>
                                                handleHeaderChange(index, "condition", e.target.value)
                                            }
                                        >
                                            <option value="">เลือกเงื่อนไข</option>
                                            {conditions.map((cond) => (
                                                <option key={cond.value} value={cond.value}>
                                                    {cond.label}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            เลือกเงื่อนไขที่เหมาะสม เช่น{" "}
                                            <span title="ตัวอย่าง: John Doe">ตรวจสอบชื่อ</span> หรือ{" "}
                                            <span title="ตัวอย่าง: example@example.com">ตรวจสอบอีเมล</span>
                                        </p>

                                        <button
                                            type="button"
                                            className={`mt-4 px-4 py-2 rounded-md text-white ${header.name.trim() && header.condition
                                                ? "bg-blue-600 hover:bg-blue-700"
                                                : "bg-gray-400 cursor-not-allowed"
                                                }`}
                                            onClick={() => {
                                                if (header.name.trim() && header.condition) {
                                                    setExpandedHeader(null);
                                                } else {
                                                    alert("กรุณากรอกข้อมูลให้ครบทั้งสองช่องก่อนบันทึก");
                                                }
                                            }}
                                            disabled={!header.name.trim() || !header.condition}
                                        >
                                            บันทึก
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className='flex flex-row'>
                            <button
                                type="button"
                                onClick={addHeader}
                                className=" bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300"
                            >
                                เพิ่ม Header
                            </button>

                            {headers.length > 1 && (
                                <div className="flex items-center">
                                    {!headers.some(header => !header.condition) ? (
                                        <button
                                            type="button"
                                            onClick={openOptionDialog}
                                            className="ml-4 bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300"
                                        >
                                            Option
                                        </button>
                                    ) : (
                                        <p className="text-sm text-red-500 ml-6">
                                            กรุณากรอกข้อมูลให้ครบทุกหัวข้อก่อนที่จะเปิด Option
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const isIncomplete = headers.some(header => !header.name.trim() || !header.condition);
                                    if (isIncomplete) {
                                        alert("กรุณากรอกข้อมูลให้ครบทุกหัวข้อ");
                                    } else {
                                        setIsDialogOpen(true);
                                    }
                                }}
                                className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                บันทึก Template
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsDowloadDialogOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                ดาวน์โหลดไฟล์
                            </button>
                        </div>

                    </form>
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileAlt} className="text-green-500 w-6 h-6" />
                        ข้อมูลเทมเพลต
                    </h2>
                    <div className="border border-gray-300 p-4 rounded-md overflow-x-auto">
                        <h4 className="text-lg font-semibold">หัวข้อคอลัมน์:</h4>
                        <div className="w-full flex flex-wrap gap-2">
                            {headers.map((header, index) => (
                                <div key={index} className="w-full md:w-auto flex flex-col border rounded-md mt-1 p-2 bg-gray-100">
                                    <span className="font-semibold">{header.name}</span>
                                    <span className="text-gray-700">{header.condition}</span>
                                </div>
                            ))}
                        </div>
                        {calculationCondition && calculationCondition.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">เงื่อนไขการคำนวณ:</h4>
                                <ul className="list-disc pl-5 text-sm md:text-base">
                                    {calculationCondition.map((condition, index) => (
                                        <li key={index} className="mt-1">
                                            {`${condition.addend} ${condition.type} ${condition.operand} = ${condition.result}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {greaterLessCondition && greaterLessCondition.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">เงื่อนไขการเปรียเทียบ:</h4>
                                <ul className="list-disc pl-5 text-sm md:text-base">
                                    {greaterLessCondition.map((condition, index) => (
                                        <li key={index} className="mt-1">
                                            {`${condition.addend} ${condition.type} ${condition.operand}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {relationCondition && relationCondition.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">เงื่อนไขความสัมพันธ์ของคอลัมน์:</h4>
                                <ul className="list-disc pl-5 text-sm md:text-base">
                                    {relationCondition.map((relation, index) => (
                                        <li key={index} className="mt-1">
                                            {`${relation.column1} ${relation.condition} ${relation.column2}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isDowloadDialogOpen && (
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
                                onClick={() => setIsDowloadDialogOpen(false)}
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

            {isOptionDialogOpen && (() => {
                const balanceColumns = headers.filter(header => header.condition === "balance");

                return (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md shadow-lg w-96">
                            <h2 className="text-lg font-bold mb-4">เลือกตัวเลือก</h2>
                            <button className={`w-full py-2 px-4 rounded-md mb-2 transition 
                                ${balanceColumns.length >= 3
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                                onClick={() => handleSelectOption("calculation")}
                                disabled={balanceColumns.length < 3}
                            >
                                ฟังก์ชันการคำนวณ
                            </button>

                            <button className={`w-full py-2 px-4 rounded-md mb-2 transition 
                                ${balanceColumns.length >= 2
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                                onClick={() => handleSelectOption("greaterless")}
                                disabled={balanceColumns.length < 2}
                            >
                                ฟังก์ชันการเปรียบเทียบ
                            </button>

                            <button
                                className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={() => handleSelectOption("column-condition")}
                            >
                                เพิ่มเงื่อนไขคอลัมน์สัมพันธ์กัน
                            </button>

                            <button
                                className="w-full mt-4 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                onClick={() => setIsOptionDialogOpen(false)}
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                );
            })()}

            {isCalculationDialogOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl overflow-y-auto max-h-[80vh]">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            เลือกเงื่อนไขสำหรับ {selectedHeader?.name}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    เลือกคอลัมน์ที่จะคำนวณ
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {headers
                                        .filter((header) => header.condition === "balance")
                                        .map((header) => (
                                            <div key={header.name} className="flex flex-col gap-2 p-2 bg-gray-100 rounded-md shadow-md">
                                                <h4 className="text-center font-medium text-gray-700">{header.name}</h4>

                                                <button
                                                    onClick={() => handleColumnSelect(header.name, 'addend')}
                                                    className={`px-4 py-2 rounded-md shadow-sm border 
                                                    ${selectedColumns.addend === header.name
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-blue-200'}
                                                    transition`}
                                                >
                                                    ตัวตั้ง (Addend)
                                                </button>

                                                <button
                                                    onClick={() => handleColumnSelect(header.name, 'operand')}
                                                    className={`px-4 py-2 rounded-md shadow-sm border 
                                                    ${selectedColumns.operand === header.name
                                                            ? 'bg-yellow-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-yellow-200'}
                                                    transition`}
                                                >
                                                    ตัวกระทำ (Operand)
                                                </button>

                                                <button
                                                    onClick={() => handleColumnSelect(header.name, 'result')}
                                                    className={`px-4 py-2 rounded-md shadow-sm border 
                                                    ${selectedColumns.result === header.name
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-green-200'}
                                                    transition`}
                                                >
                                                    คอลัมน์ผลลัพธ์ (Result)
                                                </button>
                                            </div>
                                        ))}
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">เลือกประเภทการคำนวณ</label>
                                <select
                                    value={calculationType}
                                    onChange={handleCalculationTypeChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">เลือกประเภทการคำนวณ</option>
                                    <option value="+">บวก</option>
                                    <option value="-">ลบ</option>
                                    <option value="x">คูณ</option>
                                    <option value="/">หาร</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">เงื่อนไขการคำนวณ</label>
                                <input
                                    type="text"
                                    value={`${selectedColumns.addend} ${calculationType} ${selectedColumns.operand} = ${selectedColumns.result}`}
                                    onChange={(e) => setCalculationCondition(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder={`เช่น ${selectedColumns.addend} ${calculationType} ${selectedColumns.operand} = ${selectedColumns.result}`}
                                />
                                {calculationCondition.length > 0 && (
                                    <div className="mt-4 mb-6">
                                        <h4 className="text-lg font-semibold">เงื่อนไขที่เพิ่มเข้ามา:</h4>
                                        <ul className="list-disc pl-5">
                                            {calculationCondition.map((condition, index) => (
                                                <li key={index} className="flex justify-between items-center">
                                                    {`${condition.addend} ${condition.type} ${condition.operand} = ${condition.result}`}
                                                    <button
                                                        onClick={() => removeCondition(index)}
                                                        className="ml-2 text-red-600 hover:text-red-800"
                                                    >
                                                        ลบ
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={addCondition}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    เพิ่มเงื่อนไข
                                </button>
                                <button
                                    onClick={closeOptionDialog}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isGreaterLessThanDialogOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl overflow-y-auto max-h-[80vh]">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            เลือกเงื่อนไขสำหรับการเปรียบเทียบ
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    เลือกคอลัมน์ที่จะเปรียบเทียบ
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {headers
                                        .filter((header) => header.condition === "balance")
                                        .map((header) => (
                                            <div key={header.name} className="flex flex-col gap-2 p-2 bg-gray-100 rounded-md shadow-md">
                                                <h4 className="text-center font-medium text-gray-700">{header.name}</h4>

                                                <button
                                                    onClick={() => handleGraterColumnSelect(header.name, 'addend')}
                                                    className={`px-4 py-2 rounded-md shadow-sm border 
                                                    ${selectedColumns.addend === header.name
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-blue-200'}
                                                    transition`}
                                                >
                                                    ตัวตั้ง (Addend)
                                                </button>

                                                <button
                                                    onClick={() => handleGraterColumnSelect(header.name, 'operand')}
                                                    className={`px-4 py-2 rounded-md shadow-sm border 
                                                    ${selectedColumns.operand === header.name
                                                            ? 'bg-yellow-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-yellow-200'}
                                                    transition`}
                                                >
                                                    ตัวกระทำ (Operand)
                                                </button>
                                            </div>
                                        ))}
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">เลือกประเภทการเปรียบเทียบ</label>
                                <select
                                    value={compareType}
                                    onChange={handleCompareTypeChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">เลือกประเภทการเปรียบเทียบ</option>
                                    <option value=">">มากกว่า</option>
                                    <option value="<">น้อยกว่า</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">เงื่อนไขการคำนวณ</label>
                                <input
                                    type="text"
                                    value={`${selectedColumns.addend} ${compareType} ${selectedColumns.operand}`}
                                    onChange={(e) => setCalculationCondition(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder={`เช่น ${selectedColumns.addend} ${compareType} ${selectedColumns.operand}`}
                                />
                                {greaterLessCondition.length > 0 && (
                                    <div className="mt-4 mb-6">
                                        <h4 className="text-lg font-semibold">เงื่อนไขที่เพิ่มเข้ามา:</h4>
                                        <ul className="list-disc pl-5">
                                            {greaterLessCondition.map((condition, index) => (
                                                <li key={index} className="flex justify-between items-center">
                                                    {`${condition.addend} ${condition.type} ${condition.operand}`}
                                                    <button
                                                        onClick={() => removeCompare(index)}
                                                        className="ml-2 text-red-600 hover:text-red-800"
                                                    >
                                                        ลบ
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={addGreaterLessCondition}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    เพิ่มเงื่อนไข
                                </button>
                                <button
                                    onClick={() => setIsGreaterLessThanDialogOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isColumnConditionDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">เพิ่มเงื่อนไขคอลัมน์สัมพันธ์กัน</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">เลือกคอลัมน์ที่ 1</label>
                            <select
                                value={selectedFirstColumn}
                                onChange={handleFirstColumnChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">-- เลือกคอลัมน์ --</option>
                                {headers
                                    .filter((header) => header.name !== selectedSecondColumn)
                                    .map((header) => (
                                        <option key={header.name} value={header.name}>
                                            {header.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">เลือกคอลัมน์ที่ 2</label>
                            <select
                                value={selectedSecondColumn}
                                onChange={handleSecondColumnChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">-- เลือกคอลัมน์ --</option>
                                {headers
                                    .filter((header) => header.name !== selectedFirstColumn)
                                    .map((header) => (
                                        <option key={header.name} value={header.name}>
                                            {header.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">เงื่อนไข</label>
                            <select
                                value={selectedCondition}
                                onChange={handleConditionChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">-- เลือกเงื่อนไข --</option>
                                {conditionOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {relationCondition.length > 0 && (
                            <div className="mt-4 mb-6">
                                <h4 className="text-lg font-semibold">เงื่อนไขที่เพิ่มเข้ามา:</h4>
                                <ul className="list-disc pl-5">
                                    {relationCondition.map((relation, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            {`${relation.column1} ${relation.condition} ${relation.column2}`}
                                            <button
                                                onClick={() => removeRelation(index)}
                                                className="ml-2 text-red-600 hover:text-red-800"
                                            >
                                                ลบ
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={addColumnCondition}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                เพิ่มเงื่อนไข
                            </button>
                            <button
                                onClick={() => setIsColumnConditionDialogOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDialogOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        {isSaving ? (
                            <div className="flex flex-col items-center">
                                <p className="text-lg font-semibold">กำลังบันทึก...</p>
                                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mt-3"></div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold mb-4">ตั้งชื่อ Template</h3>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2 mb-4"
                                    value={fileName}
                                    onChange={handleFileNameChange}
                                    placeholder="กรุณากรอกชื่อ Template"
                                />
                                <label htmlFor="maxRows" className="block text-sm font-medium text-gray-700 mb-2">
                                    จำนวนแถวสูงสุด:
                                </label>
                                <input
                                    type="number"
                                    id="maxRows"
                                    className="w-full border border-gray-300 rounded-md p-2 mt-2"
                                    value={maxRows}
                                    onChange={(e) => setMaxRows(Number(e.target.value))}
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    กำหนดจำนวนแถวสูงสุดที่เทมเพลตสามารถรองรับได้
                                </p>
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
                                        onClick={saveToLocalStorage}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default CreateTemplate;
