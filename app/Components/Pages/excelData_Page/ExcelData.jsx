import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveAs } from 'file-saver';

const ExcelData = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templateIDs, setTemplateIDs] = useState([]);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!userToken) {
        console.error("User token is missing");
        return;
      }

      try {
        console.log("Fetching templates for userToken:", userToken);

        const response = await fetch(`http://localhost:8080/api/save/templates/${userToken}`);

        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Template");
        }

        const data = await response.json();

        if (data && data.templates) {
          const ids = data.templates.map((template) => template.template_id);
          setTemplateIDs(ids);
        } else {
          setTemplateIDs([]);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [userToken]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!userToken || templateIDs.length === 0) return;

      try {
        console.log("Fetching uploaded files for:", userToken, "Templates:", templateIDs);

        const response = await fetch(`http://localhost:8080/api/getUploadedFiles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userToken, templateIDs })
        });

        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงไฟล์");
        }

        const data = await response.json();

        const extractedFiles = data.files.map(file => file.file_details);
        console.log("Extracted files:", extractedFiles);


        setFiles(extractedFiles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [userToken, templateIDs]);

  const fetchTemplates = async (userToken) => {
    try {
      const response = await fetch(`http://localhost:8080/api/save/templates/${userToken}`);
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching templates:", data.error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      return [];
    }
  };

  const downloadExcel = async (fileName, templateId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/save/templates/${userToken}`);
      const data = await response.json();

      if (!data || !data.templates) {
        console.error("ไม่พบข้อมูล templates");
        return;
      }

      const selectedTemplate = data.templates.find(template => template.template_id === templateId);
      if (!selectedTemplate) {
        console.error("ไม่พบ Template ที่ต้องการ");
        return;
      }

      const orderedHeaders = selectedTemplate.headers.map(header => header.name);
      console.log("Headers ที่เรียงแล้ว:", orderedHeaders);

      const exportResponse = await fetch(`http://localhost:8080/api/exportExcel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userToken, fileName, templateId, orderedHeaders })
      });

      if (!exportResponse.ok) {
        throw new Error("ไม่สามารถดาวน์โหลดไฟล์ได้");
      }

      const blob = await exportResponse.blob();
      saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };


  return (
    <div className="container mx-auto p-6 mt-28">
      <h1 className="text-2xl font-bold text-center mb-6">📂 รายการไฟล์ที่อัปโหลด</h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.length === 0 ? (
            <p className="text-center text-gray-500">ไม่มีไฟล์ที่อัปโหลด</p>
          ) : (
            files.map((file, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="flex flex-col items-center">
                  <p className="text-lg font-semibold">{file.file_name}</p>
                  <p className="text-sm text-gray-500">🕒 {new Date(file.uploaded_at).toLocaleString()}</p>
                  <button
                    onClick={() => downloadExcel(file.file_name, file.template_id)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    ดาวน์โหลดไฟล์ Excel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelData;
