import "./HowItWorks.css";
import {
  FiUploadCloud,
  FiEdit3,
  FiDownload,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiUploadCloud />,
    number: "01",
    title: "Upload PDF",
    desc: "Upload your PDF file securely with a simple drag & drop experience.",
  },
  {
    icon: <FiEdit3 />,
    number: "02",
    title: "Edit PDF",
    desc: "Add text, highlights, drawings, signatures and annotations.",
  },
  {
    icon: <FiDownload />,
    number: "03",
    title: "Download File",
    desc: "Save your edited document instantly and download it anytime.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works">

      <div className="section-header">
        <span>HOW IT WORKS</span>
        <h2>Edit PDFs in 3 Easy Steps</h2>
        <p>
          No complicated process. Upload, edit and download
          your PDF within seconds.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>

            <div className="step-number">
              {step.number}
            </div>

            <div className="step-icon">
              {step.icon}
            </div>

            <h3>{step.title}</h3>
            <p>{step.desc}</p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default HowItWorks;