import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { deleteTemplate, fetchTemplates, updateTemplate } from "@/app/Service/templateService";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [editedTemplate, setEditedTemplate] = useState({ templatename: "", headers: [], maxRows: "" });
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getTemplates = async () => {
      if (!userToken) {
        console.error("User token not found");
        setLoading(false);
        return;
      }

      setLoading(true); // เริ่มโหลดข้อมูล
      const data = await fetchTemplates(userToken);
      if (data) {
        setTemplates(data.templates || []);
      }
      setLoading(false); // โหลดเสร็จแล้ว
    };

    getTemplates();
  }, [userToken]);

  // useEffect(() => {
  //   const storedTemplates = JSON.parse(localStorage.getItem("templates")) || [];
  //   setTemplates(storedTemplates);
  // }, []);

  const handleDeleteTemplate = async (templateName) => {
    try {
      const response = await deleteTemplate(userToken, templateName); 
      if (response) {
        const updatedTemplates = templates.filter(
          (template) => template.templatename !== templateName
        );
        setTemplates(updatedTemplates);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
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
        <button
          onClick={handleAddTemplate}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          เพิ่มเทมเพลต
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
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
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-1 sm:mr-2" />
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">แก้ไขเทมเพลต</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อเทมเพลต</label>
                <input
                  type="text"
                  value={editedTemplate.templatename}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, templatename: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">จำนวน Row</label>
                <input
                  type="number"
                  value={editedTemplate.maxRows}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, maxRows: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">เงื่อนไขการตรวจสอบ</label>
              {editedTemplate.headers.map((header, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">ชื่อคอลัมน์</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      value={header.name}
                      onChange={(e) => handleHeaderChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">เงื่อนไข</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                      value={header.condition}
                      onChange={(e) => handleHeaderChange(index, 'condition', e.target.value)}
                    >
                      <option value="">เลือกเงื่อนไข</option>
                      <option value="name">ตรวจสอบชื่อ</option>
                      <option value="email">ตรวจสอบอีเมล</option>
                      <option value="phone">ตรวจสอบเบอร์โทร</option>
                      <option value="address">ตรวจสอบที่อยู่</option>
                      <option value="citizenid">ตรวจสอบบัตรประชาชน</option>
                      <option value="age">ตรวจสอบอายุ</option>
                      <option value="gender">ตรวจสอบเพศ</option>
                      <option value="balance">ตรวจสอบเกี่ยวกับการเงิน</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-2">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full md:w-auto"
              >
                บันทึก
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full md:w-auto"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;
