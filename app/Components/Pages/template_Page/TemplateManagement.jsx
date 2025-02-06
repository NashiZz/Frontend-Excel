import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEdit, faTrashAlt, faSpinner, faCopy, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from "uuid";
import { deleteTemplate, fetchTemplates, updateTemplate, updateUserTokenInBackend } from "@/app/Service/templateService";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [editedTemplate, setEditedTemplate] = useState({ templatename: "", headers: [], maxRows: "" });
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [newUserToken, setNewUserToken] = useState("");
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  useEffect(() => {
    if (!userToken) {
      const newToken = uuidv4();
      localStorage.setItem("userToken", newToken);
      setUserToken(newToken);
      updateUserTokenInBackend(newToken);
    }
  }, [userToken]); 

  useEffect(() => {
    const getTemplates = async () => {
      if (!userToken) {
        console.error("User token not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchTemplates(userToken);  
        if (data && data.templates) {
          setTemplates(data.templates); 
        } else {
          console.error("No templates found");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
      setLoading(false);
    };

    if (userToken) {
      getTemplates();
    }
  }, []); 

  const handleCopyToken = () => {
    navigator.clipboard.writeText(userToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadOldTemplate = () => {
    setIsLoadDialogOpen(true);
  };

  const handleConfirmLoadToken = () => {
    if (newUserToken.trim()) {
      localStorage.setItem("userToken", newUserToken);
      setUserToken(newUserToken);
      setIsLoadDialogOpen(false);
    }
  };

  // useEffect(() => {
  //   const storedTemplates = JSON.parse(localStorage.getItem("templates")) || [];
  //   setTemplates(storedTemplates);
  // }, []);

  const handleDeleteTemplate = async (templateName) => {
    try {
      setDeleting(true);
      const response = await deleteTemplate(userToken, templateName);
      if (response) {
        const updatedTemplates = templates.filter(
          (template) => template.templatename !== templateName
        );
        setTemplates(updatedTemplates);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddTemplate = () => {
    navigate("/createtemplate");
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setEditedTemplate({ ...template });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTemplateData = await updateTemplate(userToken, currentTemplate.templatename, editedTemplate);
      if (updatedTemplateData) {
        const updatedTemplates = templates.map((template) =>
          template.templatename === currentTemplate.templatename ? updatedTemplateData : template
        );
        setTemplates(updatedTemplates);
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving template edit:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditedTemplate({ templatename: "", headers: [], maxRows: "" });
  };

  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...editedTemplate.headers];
    updatedHeaders[index][field] = value;
    setEditedTemplate({
      ...editedTemplate,
      headers: updatedHeaders,
    });
  };

  return (
    <div className="container mx-auto p-6 pt-28">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          จัดการเทมเพลต
        </h1>
        <div className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
          <p className="text-gray-700 font-semibold">
            Token ของคุณ:{" "}
            <span className="text-blue-600 break-all pr-3">
              {showToken ? userToken : "••••••••••••"}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowToken(!showToken)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 flex items-center"
            >
              <FontAwesomeIcon icon={showToken ? faEyeSlash : faEye} className="mr-2" />
              {showToken ? "ซ่อน" : "แสดง"}
            </button>
            <button
              onClick={handleCopyToken}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              <FontAwesomeIcon icon={faCopy} className="mr-2" />
              {copied ? "คัดลอกแล้ว!" : "คัดลอก"}
            </button>
          </div>
        </div>
        <div className="flex-row gap-20">
          <button
            onClick={handleLoadOldTemplate}
            className="bg-blue-500 text-white px-4 py-2 mr-3 rounded-md hover:bg-blue-600"
          >
            โหลด Template เดิม
          </button>
          <button
            onClick={handleAddTemplate}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            เพิ่มเทมเพลต
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col mt-20 items-center">
          <p className="text-gray-500 font-semibold">กำลังโหลดเทมเพลต...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mt-3"></div>
        </div>
      ) : deleting ? (
        <div className="flex flex-col mt-20 items-center">
          <p className="text-red-800 text-lg font-semibold">กำลังลบ...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mt-3"></div>
        </div>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">ไม่มีเทมเพลตที่บันทึก</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 sm:px-4 py-2">ชื่อเทมเพลต</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">ชื่อ Header</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">เงื่อนไข</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">จำนวน Row</th>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">{template.templatename}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {template.headers.map((header, idx) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                        {header.name}
                      </span>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">
                    {template.headers.map((header, idx) => (
                      <span key={idx} className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs mr-1">
                        {header.condition}
                      </span>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2">{template.maxRows}</td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1 sm:mr-2" />
                      แก้ไข
                    </button>

                    <button
                      onClick={() => handleDeleteTemplate(template.templatename)}
                      className="bg-red-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-red-600 flex items-center"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                          กำลังลบ...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faTrashAlt} className="mr-1 sm:mr-2" />
                          ลบ
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isLoadDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">กรอก Token ของคุณ</h2>
            <input
              type="text"
              value={newUserToken}
              onChange={(e) => setNewUserToken(e.target.value)}
              className="border px-3 py-2 w-full rounded-md"
              placeholder="กรอก User Token เดิม"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsLoadDialogOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmLoadToken}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TemplateManagement;
