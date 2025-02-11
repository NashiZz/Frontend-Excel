import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTemplate = () => {
    const navigate = useNavigate();
    const { templateId } = useParams(); // รับค่า templateId จาก URL
    const [headers, setHeaders] = useState([]);
    const [fileName, setFileName] = useState("");
    const [maxRows, setMaxRows] = useState(10);
    const [calculationCondition, setCalculationCondition] = useState([]);
    const [relationCondition, setRelationCondition] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // โหลดข้อมูลจาก API หรือ Local Storage
        const fetchTemplateData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/templates/${templateId}`);
                if (response.ok) {
                    const data = await response.json();
                    setFileName(data.templatename);
                    setHeaders(data.headers);
                    setMaxRows(data.maxRows);
                    setCalculationCondition(data.condition.calculations || []);
                    setRelationCondition(data.condition.relations || []);
                } else {
                    console.error("Error fetching template data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchTemplateData();
    }, [templateId]);

    const saveChanges = async () => {
        if (!fileName.trim()) {
            alert("กรุณากรอกชื่อ Template");
            return;
        }

        const updatedTemplate = {
            templatename: fileName,
            headers: headers,
            maxRows: maxRows,
            condition: {
                calculations: calculationCondition,
                relations: relationCondition,
            },
        };

        setIsSaving(true);

        try {
            const response = await fetch(`http://localhost:8080/api/templates/${templateId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTemplate),
            });

            if (response.ok) {
                alert("บันทึกการแก้ไขเรียบร้อยแล้ว!");
                navigate("/template");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error updating template:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h2>แก้ไข Template</h2>
            <label>ชื่อ Template:</label>
            <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
            />

            <label>จำนวนแถวสูงสุด:</label>
            <input
                type="number"
                value={maxRows}
                onChange={(e) => setMaxRows(parseInt(e.target.value))}
            />

            <h3>Headers</h3>
            {headers.map((header, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={header.name}
                        onChange={(e) => {
                            const newHeaders = [...headers];
                            newHeaders[index].name = e.target.value;
                            setHeaders(newHeaders);
                        }}
                    />
                </div>
            ))}

            <button onClick={saveChanges} disabled={isSaving}>
                {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
        </div>
    );
};

export default EditTemplate;
