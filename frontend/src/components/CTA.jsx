import "./CTA.css";
import { FiUploadCloud } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="cta">

      <div className="cta-content">

        <span>START EDITING TODAY</span>

        <h2>
          Ready to Edit Your PDFs?
        </h2>

        <p>
          Upload, edit and download PDFs instantly.
          Fast, secure and easy to use.
        </p>

        <button className="cta-btn">
          <FiUploadCloud />
          Upload PDF
        </button>

      </div>

    </section>
  );
};

export default CTA; 