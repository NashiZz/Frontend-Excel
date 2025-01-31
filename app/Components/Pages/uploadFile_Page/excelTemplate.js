export const loadTemplates = (setTemplates) => {
    const storedTemplates = JSON.parse(localStorage.getItem('templates')) || [];
    setTemplates(storedTemplates.map((template) => template.templatename || 'Unnamed Template'));
};

export const getTemplateData = (templateName, setMaxRows, setCondition) => {
    const storedTemplates = JSON.parse(localStorage.getItem('templates')) || [];
    const selectedTemplateData = storedTemplates.find(template => template.templatename === templateName);

    if (selectedTemplateData) {
        setMaxRows(selectedTemplateData.maxRows);
        setCondition(selectedTemplateData.headers.map(header => header.condition));
    } else {
        setMaxRows(null);
    }
};
