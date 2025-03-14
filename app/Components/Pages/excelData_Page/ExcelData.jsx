import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveAs } from 'file-saver';

const ExcelData = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");

  useEffect(() => {
    const fetchFiles = async () => {
      if (!userToken) {
        console.error("User token is missing");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching data for userToken:", userToken);

        const response = await fetch(`http://localhost:8080/api/getUploadedFiles?userToken=${userToken}`);

        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }

        const data = await response.json();
        
        if (data && data.files) {
          setFiles(data.files); 
        } else {
          setFiles([]); 
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userToken]);

  const downloadExcel = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/exportExcel?userToken=${userToken}&docName=${fileName}`);
      if (!response.ok) {
        throw new Error('ไม่สามารถดาวน์โหลดไฟล์ได้');
      }

      const blob = await response.blob();  // แปลงข้อมูลที่รับมาเป็น Blob
      saveAs(blob, `${fileName}.xlsx`);  // ใช้ FileSaver.js ในการดาวน์โหลด
    } catch (error) {
      console.error('Error downloading file:', error);
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
                  {/* แสดงชื่อไฟล์ */}
                  <p className="text-lg font-semibold">{file.file_name}</p>
                  {/* แสดงวันที่และเวลาที่อัปโหลด */}
                  <p className="text-sm text-gray-500">🕒 {new Date(file.uploaded_at).toLocaleString()}</p>
                  {/* ปุ่มดาวน์โหลด */}
                  <button
                    onClick={() => downloadExcel(file.file_name)}
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
