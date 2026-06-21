import "./Editor.css";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import SignatureCanvas from "react-signature-canvas"; // 🔥 Signature Canvas Import

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import {
  FiUpload, FiZoomIn, FiZoomOut, FiDownload,
  FiType, FiTrash2, FiPlus, FiMinus, FiBold, FiPenTool
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
  
  // States
  const [texts, setTexts] = useState([]); 
  const [signatures, setSignatures] = useState([]); // 🔥 Track signatures
  const [isSignModalOpen, setIsSignModalOpen] = useState(false); // 🔥 Modal handle toggle
  const [activeInputId, setActiveInputId] = useState(null);
  const [activeSignId, setActiveSignId] = useState(null); // 🔥 Selected active signature
  const [draggingId, setDraggingId] = useState(null);
  const [draggingSignId, setDraggingSignId] = useState(null); // 🔥 Dragging signature track
  
  // Refs
  const dragStartPos = useRef({ x: 0, y: 0 });
  const textStartPos = useRef({ x: 0, y: 0 });
  const signStartPos = useRef({ x: 0, y: 0 }); // 🔥 Signature coordinate buffer
  const viewerRef = useRef(null);
  const signCanvasRef = useRef(null); // 🔥 Fixed Target reference for drawing canvas

  useEffect(() => {
    if (location.state?.uploadedFile) setFile(location.state.uploadedFile);
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (viewerRef.current && !viewerRef.current.contains(e.target)) {
        setActiveInputId(null);
        setActiveSignId(null);
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
      setSignatures([]);
    }
  };

  const handleViewerClick = (e) => {
    if (!isTextToolActive) return;
    if (e.target.tagName === "INPUT" || e.target.closest(".text-controls") || e.target.closest(".drag-handle") || e.target.closest(".signature-element")) return;

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

  // Text Mouse Handlers
  const handleMouseDown = (e, id, currentX, currentY) => {
    e.preventDefault();
    setDraggingId(id);
    setActiveInputId(id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    textStartPos.current = { x: currentX, y: currentY };
  };

  // 🔥 Signature Mouse Drag Handlers
  const handleSignMouseDown = (e, id, currentX, currentY) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingSignId(id);
    setActiveSignId(id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    signStartPos.current = { x: currentX, y: currentY };
  };

  const handleMouseMove = (e) => {
    // 1. Handle Text Dragging
    if (draggingId) {
      const deltaX = (e.clientX - dragStartPos.current.x) / scale;
      const deltaY = (e.clientY - dragStartPos.current.y) / scale;
      setTexts(prev => prev.map(t => t.id === draggingId ? { ...t, x: textStartPos.current.x + deltaX, y: textStartPos.current.y + deltaY } : t));
    }
    
    // 2. 🔥 Handle Signature Dragging
    if (draggingSignId) {
      const deltaX = (e.clientX - dragStartPos.current.x) / scale;
      const deltaY = (e.clientY - dragStartPos.current.y) / scale;
      setSignatures(prev => prev.map(s => s.id === draggingSignId ? { ...s, x: signStartPos.current.x + deltaX, y: signStartPos.current.y + deltaY } : s));
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setDraggingSignId(null);
  };

  // 🔥 UPDATED & FIX: Save Digital Signature Data URL Stream securely
 // 🔥 BUG-FIXED BULLETPROOF SIGNATURE SAVE FUNCTION
  const saveSignature = () => {
    // 1. Pehle check karo ki ref sahi se mila ya nahi
    if (!signCanvasRef.current) {
      alert("Canvas load hone mein dikkat hai, kripya dobara koshish karein!");
      return;
    }

    // 2. Check karo ki canvas khali toh nahi hai
    if (signCanvasRef.current.isEmpty()) {
      alert("Pehle signature board par kuch draw karein bhai! ✍️");
      return;
    }

    try {
      // 🚨 FIX: getTrimmedCanvas() ko bypass kiya taaki (0 , import_build.default) crash na ho
      // Hum seedhe library ka underlying raw HTML5 canvas access kar rahe hain
      const rawCanvas = signCanvasRef.current.getCanvas();
      
      if (!rawCanvas) {
        alert("Canvas element nahi mila!");
        return;
      }

      // Raw canvas se seedhe PNG base64 URL nikal liya
      const signImage = rawCanvas.toDataURL("image/png");

      const newSign = {
        id: Date.now(),
        page: currentPage,
        image: signImage,
        x: 100, // Default Drop coordinates
        y: 100,
        width: 140, // Base default sizing
        height: 70
      };

      setSignatures([...signatures, newSign]);
      setIsSignModalOpen(false); // Modal ab 100% band ho jayega!
    } catch (error) {
      console.error("Signature save fail layout crash:", error);
      alert("Signature save nahi ho paya, please retry!");
    }
  };

  // 🔥 HIGHLY OPTIMIZED & EXPANDED DOWNLOAD LOGIC (Merges Text + Signatures)
  const downloadPDF = async () => {
    if (!file || !viewerRef.current) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      
      const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const canvasElement = viewerRef.current.querySelector("canvas");
      
      if (!canvasElement) {
        alert("PDF Canvas load nahi hua, kripya thoda rukiye!");
        return;
      }

      const renderedWidth = canvasElement.clientWidth || canvasElement.width;
      const renderedHeight = canvasElement.clientHeight || canvasElement.height;

      // 1. EMBED TEXT FIELDS
      for (const textObj of texts) {
        const pageIndex = textObj.page - 1;
        if (pageIndex >= pages.length) continue;

        const targetPage = pages[pageIndex];
        const { width: pdfWidth, height: pdfHeight } = targetPage.getSize();

        const pdfX = (textObj.x * scale / renderedWidth) * pdfWidth;
        const pdfY = pdfHeight - ((textObj.y * scale / renderedHeight) * pdfHeight);
        const finalFontSize = textObj.fontSize * (pdfWidth / renderedWidth) * scale;

        if (!isNaN(pdfX) && !isNaN(pdfY) && finalFontSize > 0) {
          targetPage.drawText(textObj.text, {
            x: pdfX,
            y: pdfY - (finalFontSize / 4),
            size: finalFontSize,
            color: rgb(0, 0, 0),
          });
        }
      }

      // 2. 🔥 EMBED SIGNATURE IMAGES
      for (const signObj of signatures) {
        const pageIndex = signObj.page - 1;
        if (pageIndex >= pages.length) continue;

        const targetPage = pages[pageIndex];
        const { width: pdfWidth, height: pdfHeight } = targetPage.getSize();

        const pdfX = (signObj.x * scale / renderedWidth) * pdfWidth;
        const pdfY = pdfHeight - (((signObj.y * scale) / renderedHeight) * pdfHeight) - (signObj.height * (pdfHeight / renderedHeight) * scale);
        
        const finalWidth = signObj.width * (pdfWidth / renderedWidth) * scale;
        const finalHeight = signObj.height * (pdfHeight / renderedHeight) * scale;

        const signatureImageBytes = await pdfDoc.embedPng(signObj.image);

        if (!isNaN(pdfX) && !isNaN(pdfY) && finalWidth > 0 && finalHeight > 0) {
          targetPage.drawImage(signatureImageBytes, {
            x: pdfX,
            y: pdfY,
            width: finalWidth,
            height: finalHeight,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      
      const originalName = file.name ? file.name.replace(".pdf", "") : "document";
      link.download = `edited_${originalName}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, 100);
    } catch (error) {
      console.error("PDF Merge Fail:", error);
      alert("Error generating PDF file!");
    }
  };

  return (
    <div className="editor" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
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
          
          {/* 🔥 Signature Control Button */}
          <button className={isSignModalOpen ? "active-tool" : ""} onClick={() => setIsSignModalOpen(true)}>
            <FiPenTool /> Add Signature
          </button>
          
          <button className="download-btn" onClick={downloadPDF}><FiDownload /> Download</button>
        </div>

        <div className="pdf-viewer" ref={viewerRef}>
          {file && (
            <div className="pdf-container" onClick={handleViewerClick} style={{ position: "relative" }}>
              <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                <Page pageNumber={currentPage} scale={scale} renderTextLayer={false} />
              </Document>

              {/* TEXT FIELD LAYER RENDER */}
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

              {/* 🔥 DIGITAL SIGNATURE LAYER RENDER */}
              {signatures.filter(s => s.page === currentPage).map(s => (
                <div
                  key={s.id}
                  className={`signature-element ${activeSignId === s.id ? "selected-sign" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActiveSignId(s.id); }}
                  style={{
                    left: s.x * scale,
                    top: s.y * scale,
                    width: s.width * scale,
                    height: s.height * scale,
                    position: "absolute",
                    cursor: "move"
                  }}
                  onMouseDown={(e) => handleSignMouseDown(e, s.id, s.x, s.y)}
                >
                  {activeSignId === s.id && (
                    <div className="sign-mini-tools">
                      <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.map(si => si.id === s.id ? {...si, width: si.width + 10, height: si.height + 5} : si)) }}><FiPlus /></button>
                      <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.map(si => si.id === s.id ? {...si, width: Math.max(50, si.width - 10), height: Math.max(25, si.height - 5)} : si)) }}><FiMinus /></button>
                      <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(si => si.id !== s.id)) }} className="del"><FiTrash2 /></button>
                    </div>
                  )}
                  <img src={s.image} alt="signature" style={{ width: "100%", height: "100%", objectFit: "contain" }} pointerEvents="none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 DRAWING PAD MODAL */}
      {isSignModalOpen && (
        <div className="sign-modal-overlay">
          <div className="sign-modal">
            <h3>Apna Signature Draw Karo ✍️</h3>
            <div className="canvas-container">
              <SignatureCanvas
                ref={signCanvasRef} // 🚨 Match with logic useRef structure
                penColor="black"
                canvasProps={{ width: 400, height: 200, className: "sigCanvas" }}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => signCanvasRef.current.clear()} className="clear-btn">Clear</button>
              <button onClick={saveSignature} className="save-btn">Add to PDF</button>
              <button onClick={() => setIsSignModalOpen(false)} className="close-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;