"use client";

import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import RootPage from "./Components/pages/RootPage";
import ExcelUpload from "./Components/pages/uploadFile_Page/excelUpload";
import TemplateManagement from "./Components/pages/template_Page/TemplateManagement";
import CreateTemplate from "./Components/pages/template_Page/CreateTemplate";
import EditTemplate from "./Components/pages/template_Page/EditTemplate";
import ExcelData from "./Components/Pages/excelData_Page/ExcelData";

const AppRouter = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<RootPage />}>
                    <Route index element={<ExcelUpload />} />
                    <Route path="/template" element={<TemplateManagement />} />
                    <Route path="/exceldata" element={<ExcelData/>} />
                    <Route path="/createtemplate" element={<CreateTemplate />} />
                    <Route path="/edittemplate" element={<EditTemplate />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;
