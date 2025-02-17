import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { updateTemplate } from "@/app/Service/templateService";

const EditTemplate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
    const templateData = location.state?.template;

    const [fileName, setFileName] = useState("");
    const [headers, setHeaders] = useState([]);
    const [maxRows, setMaxRows] = useState(10);
    const [calculationType, setCalculationType] = useState('');
    const [calculationCondition, setCalculationCondition] = useState([]);
    const [relationCondition, setRelationCondition] = useState([]);
    const [expandedHeader, setExpandedHeader] = useState(null);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
    const [isCalculationDialogOpen, setIsCalculationDialogOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState({});
    const [isColumnConditionDialogOpen, setIsColumnConditionDialogOpen] = useState(false);
    const [selectedFirstColumn, setSelectedFirstColumn] = useState('');
    const [selectedSecondColumn, setSelectedSecondColumn] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const conditions = [
        { value: "name", label: "ตรวจสอบชื่อ" },
        { value: "email", label: "ตรวจสอบอีเมล" },
        { value: "phone", label: "ตรวจสอบเบอร์โทร" },
        { value: "address", label: "ตรวจสอบที่อยู่" },
        { value: "citizenid", label: "ตรวจสอบบัตรประชาชน" },
        { value: "age", label: "ตรวจสอบอายุ" },
        { value: "gender", label: "ตรวจสอบเพศ" },
        { value: "balance", label: "ตรวจสอบเกี่ยวกับการเงิน" },
    ];

    const conditionOptions = [
        { label: 'ต้องมีข้อมูล', value: 'notEmpty' },
        { label: 'ต้องมีค่าตาม Column ที่1', value: 'exists' },
    ];

    useEffect(() => {
        if (!templateData) {
            console.error("ไม่มีข้อมูล template ที่ส่งมา");
            navigate("/template");
            return;
        }

        setFileName(templateData.templatename || "");
        setHeaders(templateData.headers || []);
        setMaxRows(templateData.maxRows);

        const calculations = templateData.condition?.calculations || [];
        setCalculationCondition(calculations.map(calculation => ({
            addend: calculation.addend,
            type: calculation.type,
            operand: calculation.operand,
            result: calculation.result
        })));

        setRelationCondition(templateData.condition?.relations || []);
    }, [templateData, navigate]);


    const handleHeaderChange = (index, field, value) => {
        const updatedHeaders = [...headers];
        updatedHeaders[index][field] = value;
        setHeaders(updatedHeaders);
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

    const openOptionDialog = (header) => {
        setSelectedHeader(header);
        setIsOptionDialogOpen(true);
    };

    const closeOptionDialog = () => {
        setIsCalculationDialogOpen(false);
        setSelectedHeader(null);
    };

    const handleSelectOption = (option) => {
        setIsOptionDialogOpen(false);
        if (option === "calculation") {
            setIsCalculationDialogOpen(true);
        } else if (option === "column-condition") {
            setIsColumnConditionDialogOpen(true);
        }
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

    const handleCalculationTypeChange = (e) => {
        setCalculationType(e.target.value);
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

    const addColumnCondition = () => {
        if (!selectedFirstColumn || !selectedSecondColumn || !selectedCondition) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const newRelation = {
            column1: selectedFirstColumn,
            column2: selectedSecondColumn,
            condition: selectedCondition,
        };

        const isDuplicate = relationCondition.some(
            (relation) =>
                relation.column1 === newRelation.column1 &&
                relation.column2 === newRelation.column2 &&
                relation.condition === newRelation.condition
        );

        if (isDuplicate) {
            alert("เงื่อนไขนี้ถูกเพิ่มไปแล้ว");
            return;
        }

        setRelationCondition((prevState) => [...prevState, newRelation]);
        setSelectedFirstColumn('');
        setSelectedSecondColumn('');
        setSelectedCondition('');
        setIsColumnConditionDialogOpen(false);
    };

    const handleConditionChange = (e) => {
        setSelectedCondition(e.target.value);
    };

    const handleFirstColumnChange = (e) => {
        setSelectedFirstColumn(e.target.value);
    };

    const handleSecondColumnChange = (e) => {
        setSelectedSecondColumn(e.target.value);
    };

    const removeCalculationCondition = (index) => {
        const updatedConditions = calculationCondition.filter((_, i) => i !== index);
        setCalculationCondition(updatedConditions);
    };

    const removeRelationCondition = (index) => {
        const updatedRelations = relationCondition.filter((_, i) => i !== index);
        setRelationCondition(updatedRelations);
    };

    const saveChanges = async () => {
        if (!fileName.trim()) {
            alert("กรุณากรอกชื่อ Template");
            return;
        }

        const updatedTemplate = {
            templatename: fileName,
            headers,
            condition: {
                calculations: calculationCondition,
                relations: relationCondition,
            },
            maxRows,
        };

        setIsSaving(true);

        try {
            const response = await updateTemplate(userToken, templateData.templatename, updatedTemplate);

            if (response) {
                navigate("/template");
            } else {
                alert("ไม่สามารถบันทึกการแก้ไขได้");
            }
        } catch (error) {
            console.error("Error updating template:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-6 pt-28">
            <div className="flex mb-6">
                <button
                    onClick={() => navigate("/template")}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    กลับ
                </button>
                <h1 className="ml-8 text-2xl font-bold">แก้ไขเทมเพลต</h1>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">ชื่อ Template:</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">จำนวนแถวสูงสุด:</label>
                <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={maxRows}
                    onChange={(e) => setMaxRows(parseInt(e.target.value))}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-blue-500 w-6 h-6" />
                        เพิ่มหัวข้อคอลัมน์
                    </h2>

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
                                    <button
                                        type="button"
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        onClick={() => setExpandedHeader(null)}
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <button
                        type="button"
                        onClick={addHeader}
                        className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300"
                    >
                        เพิ่ม Header
                    </button>

                    {headers.length > 1 && (
                        <button
                            type="button"
                            onClick={openOptionDialog}
                            className="ml-4 bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300"
                        >
                            Option
                        </button>
                    )}
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
                                        <li key={index} className="mt-1 flex justify-between items-center">
                                            {`${condition.addend} ${condition.type} ${condition.operand} = ${condition.result}`}
                                            <button
                                                onClick={() => removeCalculationCondition(index)}
                                                className="text-red-500 ml-2"
                                            >
                                                ลบ
                                            </button>
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
                                        <li key={index} className="mt-1 flex justify-between items-center">
                                            {`${relation.column1} ${relation.condition} ${relation.column2}`}
                                            <button
                                                onClick={() => removeRelationCondition(index)}
                                                className="text-red-500 ml-2"
                                            >
                                                ลบ
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {isOptionDialogOpen && (() => {
                    const balanceColumns = headers.filter(header => header.condition === "balance");
                    console.log(balanceColumns);


                    return (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                                <h2 className="text-lg font-bold mb-4">เลือกตัวเลือก</h2>

                                <button
                                    className={`w-full py-2 px-4 rounded-md mb-2 transition 
                                ${balanceColumns.length >= 3
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        }`}
                                    onClick={() => handleSelectOption("calculation")}
                                    disabled={balanceColumns.length < 3}
                                >
                                    ฟังก์ชันการคำนวณ
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
            </div>
            <div className="flex justify-end mt-6 gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/template")}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    ยกเลิก
                </button>
                <button
                    onClick={saveChanges}
                    disabled={isSaving}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                    {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
            </div>

            {isSaving && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold">กำลังบันทึกการแก้ไข...</p>
                            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mt-3"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditTemplate;
