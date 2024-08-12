import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './index.scss';
import { PDFDocument, degrees } from 'pdf-lib';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const MIN_WIDTH = 100;
const MAX_WIDTH = 500;
const STEP = 100;
const ROTATE_STEP = 90;

function MyDocument({ file, emitDeleteFile }) {
    // pdf页数
    const [numPages, setNumPages] = useState(null);
    // 缩放比例
    const [scale, setScale] = useState(3);
    // 旋转角度数组
    const [rotations, setRotations] = useState([]);

    const onDocumentLoadSuccess = useCallback(({ numPages }) => {
        setNumPages(numPages);
        setRotations(new Array(numPages).fill(0));
    }, []);

    const changeScale = useCallback((delta) => {
        setScale((prevScale) => {
            const newScale = prevScale + delta;
            return newScale >= 1 && newScale <= 5 ? newScale : prevScale;
        });
    }, []);

    const rotateAll = useCallback(() => {
        setRotations((prevRotations) =>
            prevRotations.map(rotation => (rotation + ROTATE_STEP))
        );
    }, []);

    const rotatePage = useCallback((pageIndex) => {
        setRotations((prevRotations) =>
            prevRotations.map((rotation, index) =>
                index === pageIndex ? (rotation + ROTATE_STEP) : rotation
            )
        );
    }, []);

    const downloadRotatedPDF = async () => {
        try {
            // 读取原始PDF
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // 应用旋转
            const pages = pdfDoc.getPages();
            pages.forEach((page, index) => {
                page.setRotation(degrees(rotations[index]));
            });

            // 保存修改后的PDF
            const pdfBytes = await pdfDoc.save();

            // 创建Blob并下载
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'rotated_document.pdf';
            link.click();
        } catch (error) {
            console.error('Error downloading rotated PDF:', error);
        }
    };

    return (
        <div className='pdf-container'>
            <div className='btns'>
                <button onClick={rotateAll}>全部旋转</button>
                <button onClick={emitDeleteFile}>删除PDF</button>
                <button onClick={() => changeScale(1)} disabled={scale === 5}>放大</button>
                <button onClick={() => changeScale(-1)} disabled={scale === 1}>缩小</button>
                <button onClick={() => downloadRotatedPDF()}>下载</button>
            </div>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <div
                        className='pdf-page-box'
                        key={`page_${index + 1}`}
                        onClick={() => rotatePage(index)}
                    >
                        <div
                            style={{
                                transform: `rotate(${rotations[index]}deg)`,
                                transition: 'transform 0.3s ease',
                                width: 'fit-content'
                            }}
                        >
                            <Page
                                pageNumber={index + 1}
                                width={scale * STEP}
                            />
                        </div>
                    </div>
                ))}
            </Document>
        </div>
    );
}

export default MyDocument;