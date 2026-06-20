import React from 'react';
import './contact.css';

// Apne icons ke paths yahan configure kar lena bhai
import EmailIcon from '../assets/mail.webp';
import PhoneIcon from '../assets/call.webp';
import WhatsappIcon from '../assets/whatsapp.webp';

function ContactEnquiry() {
  const contactMethods = [
    {
      id: 1,
      icon: EmailIcon,
      title: "SEND A EMAIL",
      detail: "hello@zylobit.com",
      btnText: "SEND EMAIL",
      link: "mailto:hello@zylobit.com",
      isHighlighted: false
    },
    {
      id: 2,
      icon: PhoneIcon,
      title: "CALL NOW",
      detail: "+91 7302356804",
      btnText: "CALL US",
      link: "tel:+917302356804",
      isHighlighted: true // Isse center card par yellow border aur gradient aayega
    },
    {
      id: 3,
      icon: WhatsappIcon,
      title: "CHAT ON WHATSAPP",
      detail: "Say Hello on Whatsapp",
      btnText: "CHAT NOW",
      link: "https://wa.me/917302356804", // Aap apna number change kar sakte ho
      isHighlighted: false
    }
  ];

  return (
    <section className="enquiry-section">
      <div className="enquiry-container">
        
        {/* HEADING ZONE */}
        <div className="enquiry-header">
          <h2 className="enquiry-main-title">Contact us for</h2>
          <h3 className="enquiry-sub-title">Project Enquiries</h3>
        </div>

        {/* CARDS GRID WRAPPER */}
        <div className="enquiry-cards-grid">
          {contactMethods.map((method) => (
            <div 
              key={method.id} 
              className={`enquiry-card ${method.isHighlighted ? 'highlighted-card' : ''}`}
            >
              {/* Icon Container */}
              <div className="enquiry-icon-box">
                <img src={method.icon} alt={method.title} className="enquiry-img" />
              </div>

              {/* Card Meta Content */}
              <h4 className="card-action-title">{method.title}</h4>
              <p className="card-action-detail">{method.detail}</p>

              {/* Action Button */}
              <a href={method.link} className="card-action-btn">
                {method.btnText}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ContactEnquiry;