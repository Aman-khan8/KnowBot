import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (buffer) => {
    try {
        const parser = new PDFParse({ data: buffer });

        const result = await parser.getText();

        await parser.destroy();

        return result.text;
    } catch (err) {
        throw new Error(
            "Failed to extract text from PDF: " + err.message
        );
    }
};

export default extractTextFromPDF;