import { Template } from 'petit_nodejs_publipost_connector';
import ab from 'to-array-buffer';
import XlsxTemplate from './excel_module';

type delimitersType = {
    start: string;
    end: string;
};

const delimiters: delimitersType = { start: '{{', end: '}}' };

export default class ExcelTemplate implements Template {
    data: any;
    placeholders: string[];
    constructor(data: any) {
        this.data = data;
    }
    async init() {
        this.placeholders = new XlsxTemplate(this.data, delimiters).getAllPlaceholders();
    }
    async render(data: any, options?: any) {
        const template = new XlsxTemplate(this.data, delimiters);
        template.sheets.forEach((sheet: { id: number | string; }) => template.substitute(sheet.id, data));
        return Buffer.from(ab(template.generate()));
    }
    getAllPlaceholders() {
        return this.placeholders;
    }
}


