import "./Hero.css";
import { useNavigate } from "react-router-dom"; // Navigation hook import kiya
import { FiUpload, FiCheck } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();

  // File select hone par chalne wala function
  const handleHomeFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File state ko piche se lekar automatic /editor page par bhej rhe hain
      navigate("/editor", { state: { uploadedFile: file } });
    }
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-badge">🚀 Modern PDF Editing Platform</span>

        <h1>
          Edit PDFs <br />
          Effortlessly
        </h1>

        <p>
          Upload, edit, annotate and download PDFs in seconds. Add text,
          highlight content, draw signatures and manage documents with ease.
        </p>

        <div className="hero-features">
          <div>
            <FiCheck />
            <span>Add Text</span>
          </div>

          <div>
            <FiCheck />
            <span>Highlight Content</span>
          </div>

          <div>
            <FiCheck />
            <span>Draw & Sign PDFs</span>
          </div>

          <div>
            <FiCheck />
            <span>Fast Download</span>
          </div>
        </div>

        <div className="hero-buttons">
          {/* Label ko button ki tarah use kiya taaki click par hidden input trigger ho sake */}
          <label className="primary-btn" style={{ cursor: "pointer" }}>
            <FiUpload />
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleHomeFileUpload}
            />
          </label>

          <button className="secondary-btn" onClick={() => navigate("/editor")}>
            Try Demo
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="pdf-card">
          <div className="pdf-header">PDF Preview</div>

          <div className="pdf-page">
            <h3>Contract.pdf</h3>

            <div className="fake-line"></div>
            <div className="fake-line short"></div>

            <div className="highlight-box">Highlighted Text</div>

            <div className="text-tag">+ Added Text</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;