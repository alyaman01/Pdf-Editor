import "./Footer.css";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-top">
        <h2>Edit PDFs Faster. Work Smarter.</h2>
        <p>
          Trusted PDF editing platform for students,
          professionals and businesses.
        </p>
      </div>

      <div className="footer-content">

        <div className="footer-brand">
          <h2>PDFCraft</h2>
          <p>
            Smart PDF Editing Platform that helps
            users edit, annotate and manage PDFs
            effortlessly.
          </p>

          <div className="social-icons">
            <FiGithub />
            <FiLinkedin />
            <FiTwitter />
            <FiInstagram />
          </div>
        </div>

        <div className="footer-links">
          <h3>Tools</h3>
          <a href="#">Edit PDF</a>
          <a href="#">Merge PDF</a>
          <a href="#">Split PDF</a>
          <a href="#">Compress PDF</a>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <a href="#">About</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-links">
          <h3>Resources</h3>
          <a href="#">Help Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 PDFCraft. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;