import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEdit, faTrashAlt, faCopy, faEyeSlash, faEye, faChevronDown, faChevronUp, faCloudArrowDown, faFileArrowDown, faPlus, faTrash, faDownload, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from "uuid";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { deleteTemplate, duplicateTemplate, fetchTemplates, updateUserTokenInBackend } from "@/app/Service/templateService";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [templateToCopy, setTemplateToCopy] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templateToDownload, setTemplateToDownload] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [editedTemplate, setEditedTemplate] = useState({ templatename: "", headers: [], maxRows: "" });
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || "");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [copying, setCopying] = useState(false);
  const [downloding, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [newUserToken, setNewUserToken] = useState("");
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [isLoadToken, setIsLoadToken] = useState(false);
  const [isExpanded, setIsExpanded] = useState({});
  const navigate = useNavigate();

  const toggleExpand = (templateName) => {
    setIsExpanded((prev) => ({
      ...prev,
      [templateName]: !prev[templateName],
    }));
  };

  useEffect(() => {
    if (!userToken) {
      setLoading(false);
      return;
    }

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
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
      setLoading(false);
    };

    getTemplates();
  }, [userToken]);

  const handleCreateUserToken = async () => {
    setIsLoadToken(true);

    const newToken = uuidv4();

    try {
      const response = await updateUserTokenInBackend(newToken);

      if (response && response.data && response.data.message === "User token added successfully") {
        console.log("User token updated in backend successfully");

        localStorage.setItem("userToken", newToken);
        setUserToken(newToken);

        const data = await fetchTemplates(newToken);
        if (data && data.templates) {
          setTemplates(data.templates);
        } else {
          console.error("No templates found");
        }
      } else {
        console.error("Failed to update user token: ", response?.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating user token in backend:", error);
    }

    setIsLoadToken(false);
  };

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

  const handleDuplicateTemplate = (template) => {
    duplicateTemplate(template, userToken, setTemplates, setCopying, setShowCopyDialog);
  };

  const openDeleteDialog = (template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const openCopyDialog = (template) => {
    setTemplateToCopy(template);
    setShowCopyDialog(true);
  };

  const openDownloadDialog = (template) => {
    setTemplateToDownload(template);
    setShowDownloadDialog(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      setDeleting(true);
      const response = await deleteTemplate(userToken, templateId);
      if (response) {
        const updatedTemplates = templates.filter(
          (template) => template.template_id !== templateId
        );
        setTemplates(updatedTemplates);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAddTemplate = () => {
    navigate("/createtemplate");
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setEditedTemplate({ ...template });

    navigate("/edittemplate", { state: { template: template } });
  };

  const generateExcel = async (headers, fileName) => {
    if (!headers || headers.length === 0) {
      console.error("ไม่มี headers สำหรับสร้างไฟล์ Excel");
      return;
    }
    setDownloading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Template");

      worksheet.columns = headers.map(header => ({
        header: header.name,
        key: header.key,
        width: 20
      }));

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDDDDDD" },
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างไฟล์ Excel:", error);
    } finally {
      setDownloading(false);
      setShowDownloadDialog(false);
    }
  };

  return (
    <div className="container mx-auto p-6 pt-28">
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          การจัดการเทมเพลต
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row mb-2 justify-between">
        <div className="bg-white shadow-md p-4 rounded-lg flex items-center justify-between w-full sm:w-2/3">
          <p className="text-gray-600 font-medium">
            Token ของคุณ:{" "}
            <span className="text-blue-600 break-all pr-3">
              {userToken ? (
                showToken ? userToken : "••••••••••••"
              ) : (
                <button
                  onClick={handleCreateUserToken}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  สร้าง User Token
                </button>
              )}
            </span>
          </p>
          {userToken && (
            <div className="flex gap-3">
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
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
          <button
            onClick={handleLoadOldTemplate}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition flex items-center w-full sm:w-auto"
          >
            <FontAwesomeIcon icon={faCloudArrowDown} className="mr-2" />
            โหลด Template เดิม
          </button>
          <button
            className={`bg-green-500 text-white px-5 py-2 rounded-lg flex items-center w-full sm:w-auto ${!userToken ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
            onClick={userToken ? handleAddTemplate : undefined}
            disabled={!userToken}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            เพิ่มเทมเพลต
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col mt-20 items-center">
          <p className="text-gray-500 font-semibold">กำลังโหลดเทมเพลต...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mt-3"></div>
        </div>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">ไม่มีเทมเพลตที่บันทึก</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left h-16">
                <th className="px-2 sm:px-4 py-2">
                  <span></span>
                </th>
                <th className="px-2 sm:px-4 py-2">ชื่อเทมเพลต</th>
                <th className="px-2 sm:px-4 py-2">ชื่อ Header</th>
                <th className="px-2 sm:px-4 py-2">จำนวน Row</th>
                <th className="px-2 sm:px-4 py-2">จัดการ</th>
                <th className="px-2 sm:px-4 py-2">
                  <span></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template, index) => (
                <React.Fragment key={index}>
                  <tr className="text-left border-b h-20 hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2">
                      <button
                        onClick={() => toggleExpand(template.templatename)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FontAwesomeIcon
                          icon={isExpanded[template.templatename] ? faChevronUp : faChevronDown}
                        />
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-2 font-medium">{template.templatename}</td>
                    <td className="px-2 sm:px-4 py-2">
                      {template.headers.map((header, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-1">
                          {header.name}
                        </span>
                      ))}
                    </td>
                    <td className="px-2 text-center sm:px-4 py-2">{template.maxRows}</td>
                    <td className="px-2 sm:px-4 py-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(template)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <button
                        onClick={() => openDownloadDialog(template)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2"
                      >
                        <FontAwesomeIcon icon={faFileArrowDown} />
                      </button>
                      <button
                        onClick={() => openCopyDialog(template)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </td>
                  </tr>

                  {isExpanded[template.templatename] && (
                    <tr>
                      <td colSpan="6" className="px-8 py-4 bg-gray-50">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="sm:w-1/3">
                            <h3 className="text-gray-700 font-semibold">เงื่อนไขในการเช็ค</h3>
                            <ul className="list-disc pl-5 text-gray-600">
                              {template.headers.map((header, idx) => (
                                <li key={idx} className="mt-1">
                                  <strong>หัวข้อ {header.name}:</strong> {header.condition || "ไม่มีเงื่อนไข"}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="sm:w-1/3">
                            <h3 className="text-gray-700 font-semibold">เงื่อนไขในการคำนวณ</h3>
                            <ul className="list-disc pl-5 text-gray-600">
                              {template.condition?.calculations?.length > 0 ? (
                                template.condition.calculations?.map((calc, idx) => (
                                  <li key={idx} className="mt-1">
                                    {`${calc.expression.join(" ")} = ${calc.result}`}
                                  </li>
                                ))
                              ) : (
                                <li className="mt-1">ไม่มีเงื่อนไขการคำนวณ</li>
                              )}
                            </ul>
                          </div>
                          <div className="sm:w-1/3">
                            <h3 className="text-gray-700 font-semibold">เงื่อนไขในการเปรียบเทียบ</h3>
                            <ul className="list-disc pl-5 text-gray-600">
                              {template.condition?.compares?.length > 0 ? (
                                template.condition.compares?.map((calc, idx) => (
                                  <li key={idx} className="mt-1">
                                    {calc.addend} {calc.type} {calc.operand}
                                  </li>
                                ))
                              ) : (
                                <li className="mt-1">ไม่มีเงื่อนไขการเปรียบเทียบ</li>
                              )}
                            </ul>
                          </div>
                          <div className="sm:w-1/3">
                            <h3 className="text-gray-700 font-semibold">เงื่อนไขความสัมพันธ์ของคอลัมน์</h3>
                            <ul className="list-disc pl-5 text-gray-600">
                              {template.condition?.relations?.length > 0 ? (
                                template.condition.relations.map((rel, idx) => (
                                  <li key={idx} className="mt-1">
                                    <strong>{rel.column1}</strong> ต้อง <strong>{rel.condition}</strong> กับ <strong>{rel.column2}</strong>
                                  </li>
                                ))
                              ) : (
                                <li className="mt-1">ไม่มีเงื่อนไขความสัมพันธ์</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {(showDeleteDialog || showCopyDialog || showDownloadDialog) && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
              {showDeleteDialog && (
                <div className="bg-white rounded-lg p-6 w-120 shadow-lg">
                  {deleting ? (
                    <div className="flex flex-col px-6 items-center">
                      <p className="text-red-800 text-lg font-semibold">กำลังลบ...</p>
                      <div className="w-8 h-8 border-4 border-red-500 border-dashed rounded-full animate-spin mt-3"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FontAwesomeIcon icon={faTrash} className="text-red-600 text-4xl mb-4" />
                      <h2 className="text-xl font-semibold mb-4">คุณแน่ใจหรือไม่ที่จะลบเทมเพลตนี้?</h2>
                      <h2 className="text-lg font-semibold text-blue-800">{templateToDelete?.templatename}</h2>
                      <div className="mt-6 flex justify-between gap-4">
                        <button
                          onClick={closeDeleteDialog}
                          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(templateToDelete.template_id)}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          ยืนยันการลบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showCopyDialog && (
                <div className="bg-white rounded-lg p-6 w-120 shadow-lg">
                  {copying ? (
                    <div className="flex flex-col px-6 items-center">
                      <p className="text-blue-800 text-lg font-semibold">กำลังคัดลอก...</p>
                      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mt-3"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FontAwesomeIcon icon={faCopy} className="text-blue-600 text-4xl mb-4" />
                      <h2 className="text-xl font-semibold mb-4">คุณต้องการคัดลอกเทมเพลตนี้ใช่หรือไม่?</h2>
                      <h2 className="text-lg font-semibold text-blue-800">{templateToCopy.templatename}</h2>
                      <div className="mt-6 flex justify-between gap-4">
                        <button
                          onClick={() => setShowCopyDialog(false)}
                          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(templateToCopy)}
                          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          คัดลอก
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showDownloadDialog && (
                <div className="bg-white rounded-lg p-6 w-120 shadow-lg">
                  {downloding ? (
                    <div className="flex flex-col px-6 items-center">
                      <p className="text-blue-800 text-lg font-semibold">กำลังดาวน์โหลดไฟล์...</p>
                      <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin mt-3"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FontAwesomeIcon icon={faDownload} className="text-green-600 text-4xl mb-4" />
                      <h2 className="text-xl font-semibold mb-4">คุณต้องการดาวน์โหลดเทมเพลตนี้ใช่หรือไม่?</h2>
                      <h2 className="text-lg font-semibold text-blue-800">{templateToDownload.templatename}</h2>
                      <div className="mt-6 flex justify-between gap-4">
                        <button
                          onClick={() => setShowDownloadDialog(false)}
                          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => generateExcel(templateToDownload.headers, templateToDownload.templatename)}
                          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          ดาวน์โหลด
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {
        isLoadDialogOpen && (
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
        )
      }
      {
        isLoadToken && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <p className="mb-4">กำลังสร้าง User Token...</p>
              <div className="loader"></div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default TemplateManagement;

