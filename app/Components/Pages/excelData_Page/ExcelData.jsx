import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { downloadExcelFile, fetchTemplateData, fetchUploadedFiles } from "@/app/Service/excelDataService";

const ExcelData = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [templateIDs, setTemplateIDs] = useState([]);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");

  useEffect(() => {
    const loadTemplates = async () => {
      if (!userToken) {
        console.error("User token is missing");
        return;
      }

      const data = await fetchTemplateData(userToken);
      if (data.templates) {
        setTemplateIDs(data.templates.map(template => template.template_id));
      }
    };

    loadTemplates();
  }, [userToken]);

  useEffect(() => {
    const loadFiles = async () => {
      if (!userToken || templateIDs.length === 0) return;

      setLoading(true);
      const uploadedFiles = await fetchUploadedFiles(userToken, templateIDs);
      setFiles(uploadedFiles);
      setLoading(false);
    };

    loadFiles();
  }, [userToken, templateIDs]);

  const handleDownload = async (fileName, templateId) => {
    setDownloadingFile(fileName); 
    await downloadExcelFile(userToken, fileName, templateId);
    setDownloadingFile(null); 
  };

  return (
    <div className="container mx-auto p-6 mt-28 relative">
      <h1 className="text-2xl font-bold text-center mb-6">📂 รายการไฟล์ที่อัปโหลด</h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-32">
          <p className="text-gray-500 font-semibold">กำลังโหลดข้อมูล...</p>
          <Loader2 className="animate-spin text-gray-500 w-12 h-12 mb-4 mt-3" />
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
                    onClick={() => handleDownload(file.file_name, file.template_id)}
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

      {downloadingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="animate-spin text-gray-500 w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">กำลังดาวน์โหลดไฟล์...</p>
            <p className="text-sm text-gray-500">{downloadingFile}.xlsx</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelData;
