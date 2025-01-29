import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const parseExcelFile = (file, setHeaders, setRows) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (sheetData.length > 0) {
            setHeaders(sheetData[0]);
            setRows(sheetData.slice(1));
        }
    };
    reader.readAsArrayBuffer(file);
};

export const generateErrorReport = async (headers, rows, errors) => {
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [{ width: 10 }, { width: 80 }];

    const summaryHeader = summarySheet.addRow(['ลำดับ', 'ข้อผิดพลาด']);
    summaryHeader.height = 25;
    summaryHeader.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const errorDetails = errors
        .filter(error => error.errorDetails !== undefined)
        .flatMap(error => error.errorDetails);

    errorDetails.forEach((detail, index) => {
        summarySheet.addRow([index + 1, detail.trim()]);
    });

    const dataSheet = workbook.addWorksheet('Data');
    dataSheet.columns = headers.map(() => ({ width: 40 }));
    const dataHeader = dataSheet.addRow(headers);
    dataHeader.height = 25;
    dataHeader.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    rows.forEach((row) => {
        dataSheet.addRow(row);
    });

    const validErrors = errors.filter(error => error.row !== undefined && error.column !== undefined);
    validErrors.forEach(({ row, column }) => {
        const dataRow = dataSheet.getRow(row + 1);
        if (dataRow) {
            const cell = dataRow.getCell(column + 1);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' },
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } },
            };
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'error_report.xlsx');
};
