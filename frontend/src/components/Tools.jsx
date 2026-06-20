import "./Tools.css";
import {
  FiEdit,
  FiLayers,
  FiScissors,
  FiMinimize2,
  FiFileText,
  FiRepeat,
  FiRotateCw,
  FiPenTool,
} from "react-icons/fi";

const tools = [
  { icon: <FiEdit />, title: "Edit PDF" },
  { icon: <FiLayers />, title: "Merge PDF" },
  { icon: <FiScissors />, title: "Split PDF" },
  { icon: <FiMinimize2 />, title: "Compress PDF" },
  { icon: <FiFileText />, title: "PDF to Word" },
  { icon: <FiRepeat />, title: "Word to PDF" },
  { icon: <FiRotateCw />, title: "Rotate PDF" },
  { icon: <FiPenTool />, title: "Sign PDF" },
];

const Tools = () => {
  return (
    <section className="tools">
      <h2>Popular PDF Tools</h2>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <div key={index} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tools;