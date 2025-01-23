import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./DonationPage.css"

const DonationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    link: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Replace these with your EmailJS credentials
  const serviceID = "service_5dyjl7n";
  const templateID = "template_cy1cjo8";
  const userID = "v2SQuPUQxIATjqJqv";

  // Send email using EmailJS
  emailjs
    .send(
      serviceID,
      templateID,
      {
        name: formData.name,
        email: formData.email,
        link: formData.link,
        message: formData.message,
      },
      userID
    )
    .then(
      (response) => {
        console.log("Email sent successfully!", response);
        alert("Thank you for your donation! We'll be in touch soon.");
        // Reset the form
        setFormData({
          name: "",
          email: "",
          link: "",
          message: "",
        });
      },
      (error) => {
        console.error("Failed to send email:", error);
        alert("Something went wrong. Please try again.");
      }
    );
};

  return (
    <div className="donation-home">
      <div className="donation-wrapper">
        <div className="donation-form-box">
          <h2 className="donation-title">Support PASD</h2>
                  <p className="donation-text">Thank you for considering a donation.</p>
                  <p className="donation-text">Your contribution helps us continue our work.</p>
          <form onSubmit={handleSubmit}>
            <div className="donation-input-box">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Name</label>
            </div>
            <div className="donation-input-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>
            <div className="donation-input-box">
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
              />
              <label>Donation Drive Link</label>
            </div>
            <div className="donation-input-box">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
              <label>Message (optional)</label>
            </div>
            <button type="submit" className="donation-btn">
              Submit Donation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;