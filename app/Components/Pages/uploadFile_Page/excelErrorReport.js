import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const downloadErrorReport = async (errors, headers, rows) => {
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Summary');

    summarySheet.columns = [
        { width: 10 },
        { width: 80 },
    ];

    const summaryHeader = summarySheet.addRow(['ลำดับ', 'ข้อผิดพลาด']);

    summaryHeader.height = 25;

    summaryHeader.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const errorDetails = errors
        .filter(error => error.errorDetails !== undefined)
        .flatMap(error => error.errorDetails);

    console.log('Error Details:', errorDetails);

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

    const validErrors = errors
    .flatMap(error => error.errorList ? error.errorList : [error])
    .filter(error => error.row !== undefined && error.column !== undefined);

    console.log(validErrors);
    
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