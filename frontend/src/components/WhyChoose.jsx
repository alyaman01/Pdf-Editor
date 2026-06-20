import "./WhyChoose.css";
import {
  FiZap,
  FiShield,
  FiCloud,
  FiSmartphone,
} from "react-icons/fi";

const features = [
  {
    icon: <FiZap />,
    title: "Fast Processing",
    desc: "Edit and download PDFs within seconds with optimized performance.",
  },
  {
    icon: <FiShield />,
    title: "Secure Files",
    desc: "Your documents remain encrypted and protected at all times.",
  },
  {
    icon: <FiCloud />,
    title: "Cloud Storage",
    desc: "Access your PDFs anytime and from any device.",
  },
  {
    icon: <FiSmartphone />,
    title: "Multi Device Support",
    desc: "Works seamlessly on desktop, tablet and mobile devices.",
  },
];

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <div className="section-header">
        <span>WHY CHOOSE US</span>
        <h2>Why Choose PDFCraft?</h2>
        <p>
          Everything you need to manage, edit and share PDFs
          in one powerful platform.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChoose;