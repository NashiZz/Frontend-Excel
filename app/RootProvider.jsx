"use client";

import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ExcelUpload from "./Components/pages/uploadFile_Page/excelUpload";
import RootPage from "./Components/pages/RootPage";
import CreateTemplate from "./Components/Pages/template_Page/CreateTemplate";
import TemplateManagement from "./Components/pages/template_Page/TemplateManagement";

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
                    <Route path="/createtemplate" element={<CreateTemplate />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;
