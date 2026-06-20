import "./Editor.css";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  FiUpload, FiZoomIn, FiZoomOut, FiDownload,
  FiType, FiTrash2, FiPlus, FiMinus, FiBold
} from "react-icons/fi";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Editor = () => {
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTextToolActive, setIsTextToolActive] = useState(false);
  const [texts, setTexts] = useState([]); 
  const [activeInputId, setActiveInputId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const textStartPos = useRef({ x: 0, y: 0 });
  const viewerRef = useRef(null);

  useEffect(() => {
    if (location.state?.uploadedFile) setFile(location.state.uploadedFile);
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (viewerRef.current && !viewerRef.current.contains(e.target)) {
        setActiveInputId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCurrentPage(1);
      setTexts([]);
    }
  };

  const handleViewerClick = (e) => {
    if (!isTextToolActive) return;
    if (e.target.tagName === "INPUT" || e.target.closest(".text-controls") || e.target.closest(".drag-handle")) return;

    const rect = viewerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const newId = Date.now();
    const newText = {
      id: newId,
      page: currentPage,
      text: "New Text",
      x: x,
      y: y,
      fontSize: 12,
      isBold: false,
    };

    setTexts([...texts, newText]);
    setActiveInputId(newId);
    setIsTextToolActive(false);
  };

  const handleMouseDown = (e, id, currentX, currentY) => {
    e.preventDefault();
    setDraggingId(id);
    setActiveInputId(id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    textStartPos.current = { x: currentX, y: currentY };
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;
    const deltaX = (e.clientX - dragStartPos.current.x) / scale;
    const deltaY = (e.clientY - dragStartPos.current.y) / scale;
    setTexts(prev => prev.map(t => t.id === draggingId ? { ...t, x: textStartPos.current.x + deltaX, y: textStartPos.current.y + deltaY } : t));
  };

  // 🔥 HIGHLY OPTIMIZED & FIXED DOWNLOAD LOGIC
  const downloadPDF = async () => {
    if (!file || !viewerRef.current) return;

    try {
      const fileBytes = await file.arrayBuffer();
      
      // FIX 1: ignoreEncryption: true lagaya taaki secure PDFs lock na karein
      const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const canvasElement = viewerRef.current.querySelector("canvas");
      
      if (!canvasElement) {
        alert("PDF Canvas load nahi hua, kripya thoda rukiye!");
        return;
      }

      const renderedWidth = canvasElement.clientWidth;
      const renderedHeight = canvasElement.clientHeight;

      for (const textObj of texts) {
        const pageIndex = textObj.page - 1;
        if (pageIndex >= pages.length) continue;

        const targetPage = pages[pageIndex];
        const { width: pdfWidth, height: pdfHeight } = targetPage.getSize();

        // Exact Scaling Coordinates Ratio
        const pdfX = (textObj.x * scale / renderedWidth) * pdfWidth;
        const pdfY = pdfHeight - ((textObj.y * scale / renderedHeight) * pdfHeight);
        const finalFontSize = textObj.fontSize * (pdfWidth / renderedWidth) * scale;

        targetPage.drawText(textObj.text, {
          x: pdfX,
          y: pdfY - (finalFontSize / 4),
          size: finalFontSize,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      
      // FIX 2: Proper Type Allocation taaki blank file na bane
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      
      // Extension check toggle logic
      const originalName = file.name ? file.name.replace(".pdf", "") : "document";
      link.download = `edited_${originalName}.pdf`; // Sahi format forced extension
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean-up DOM
    } catch (error) {
      console.error("PDF Merge Fail:", error);
      alert("Error generating PDF file!");
    }
  };

  return (
    <div className="editor" onMouseMove={handleMouseMove} onMouseUp={() => setDraggingId(null)}>
      <aside className="sidebar">
        <h3>Pages</h3>
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`} onClick={() => setCurrentPage(i + 1)}>
            Page {i + 1}
          </div>
        ))}
      </aside>

      <div className="editor-content">
        <div className="toolbar">
          <button onClick={() => setScale(s => s + 0.1)}><FiZoomIn /></button>
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><FiZoomOut /></button>
          <label className="upload-btn" style={{ margin: 0, cursor: 'pointer' }}>
            <FiUpload /> Upload PDF
            <input type="file" accept="application/pdf" hidden onChange={handleFileUpload} />
          </label>
          <button className={isTextToolActive ? "active-tool" : ""} onClick={() => setIsTextToolActive(!isTextToolActive)}>
            <FiType /> Add Text
          </button>
          <button className="download-btn" onClick={downloadPDF}><FiDownload /> Download</button>
        </div>

        <div className="pdf-viewer" ref={viewerRef}>
          {file && (
            <div className="pdf-container" onClick={handleViewerClick} style={{ position: "relative" }}>
              <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                <Page pageNumber={currentPage} scale={scale} renderTextLayer={false} />
              </Document>

              {texts.filter(t => t.page === currentPage).map(t => (
                <div 
                  key={t.id} 
                  className={`text-element ${activeInputId === t.id ? "selected" : ""}`}
                  style={{ left: t.x * scale, top: t.y * scale, position: "absolute", transform: "translate(0, -50%)" }}
                >
                  {activeInputId === t.id && (
                    <div className="mini-tools">
                      <button onClick={() => setTexts(texts.map(tx => tx.id === t.id ? {...tx, fontSize: tx.fontSize + 1} : tx))}><FiPlus /></button>
                      <button onClick={() => setTexts(texts.map(tx => tx.id === t.id ? {...tx, fontSize: Math.max(8, tx.fontSize - 1)} : tx))}><FiMinus /></button>
                      <button onClick={() => setTexts(texts.map(tx => tx.id === t.id ? {...tx, isBold: !tx.isBold} : tx))}><FiBold /></button>
                      <button onClick={() => setTexts(texts.filter(tx => tx.id !== t.id))} className="del"><FiTrash2 /></button>
                      <div className="drag-handle" onMouseDown={(e) => handleMouseDown(e, t.id, t.x, t.y)}>⠿</div>
                    </div>
                  )}
                  <input
                    autoFocus
                    className="minimal-input"
                    value={t.text}
                    onChange={(e) => setTexts(texts.map(tx => tx.id === t.id ? {...tx, text: e.target.value} : tx))}
                    onFocus={() => setActiveInputId(t.id)}
                    style={{
                      fontSize: t.fontSize * scale,
                      fontWeight: t.isBold ? "bold" : "normal",
                      width: `${(t.text.length + 1)}ch`
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;