const saveToLocalStorage = async () => {
    if (!fileName.trim()) {
        alert("กรุณากรอกชื่อ Template");
        return;
    }

    const userToken = getUserToken();
    const newTemplate = {
        userToken: userToken,
        templatename: fileName,
        headers: headers,
        maxRows: maxRows,
        condition: {
            calculations: calculationCondition
        }
    };

    const existingTemplates = JSON.parse(localStorage.getItem("templates")) || [];
    existingTemplates.push(newTemplate);
    localStorage.setItem("templates", JSON.stringify(existingTemplates));

    try {
        const response = await fetch("http://localhost:8000/api/save/templates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTemplate),
        });
        const data = await response.json();
        if (response.ok) {
            alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
            setIsDialogOpen(false);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error saving template:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
};
