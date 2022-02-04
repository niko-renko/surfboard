import React from 'react';
import pdfjs from 'pdfjs-dist';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

import Base from '../Base';

class PDF extends Base
{
    convertDataURIToBinary = dataURI => {
        // Copied from https://stackoverflow.com/questions/12092633/pdf-js-rendering-a-pdf-file-using-a-base64-file-source-instead-of-url
        const base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
        const base64 = dataURI.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for(let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }

        return array;
    };

    // Download PDF
    loadPDF = async () => {
        const file = this.props.files.find(
            file => file.name === this.props.file
        );

        const pdfAsArray = this.convertDataURIToBinary(file.data);
        const download = pdfjs.getDocument(pdfAsArray);

        const pdf = await download.promise;

        // Update current pdf
        this.update(
            {
                file: this.props.file,
                pdf
            }
        );

        // Push number of pages upwards
        this.props.dispatch(
            {
                type: 'updatePages',
                pages: pdf.numPages
            }
        );

        return;
    };

    // Render one page of a PDF file
    renderPDF = async () => {
        const PDFPage = await this.state.pdf.getPage(this.props.page);

        const viewport = PDFPage.getViewport(
            {
                scale: 1.3
            }
        );

        const canvas = this.canvas.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await PDFPage.render(
            {
                canvasContext: canvas.getContext('2d'),
                viewport
            }
        );

        return;
    };

    updatePDF = async () => {
        if(this.props.file !== this.state.file)
            await this.loadPDF();

        await this.renderPDF();

        return;
    };

    state = {
        file: undefined,
        pdf: undefined
    };

    constructor(props)
    {
        super(props);

        this.canvas = React.createRef();

        return;
    }

    // React only to filename or page number updates
    shouldComponentUpdate = nextProps => {
        if(this.props.file === nextProps.file && this.props.page === nextProps.page)
            return false;

        return true;
    };

    // Same handlers
    componentDidMount = this.updatePDF;
    componentDidUpdate = this.updatePDF;

    render = () => {
        return (
            <canvas
                ref={this.canvas}
            >
            </canvas>
        );
    };
}

export default PDF.export;