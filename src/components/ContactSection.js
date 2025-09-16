import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY; // EmailJS public key (formerly user ID)

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    if (!PUBLIC_KEY) {
      // eslint-disable-next-line no-console
      console.error('EmailJS public key missing. Set REACT_APP_EMAILJS_PUBLIC_KEY in your env.');
      return;
    }
    try {
      emailjs.init(PUBLIC_KEY);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('EmailJS init failed:', e);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus === 'success') return; // prevent re-submit after sent

    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      // eslint-disable-next-line no-console
      console.error('EmailJS env vars missing. Set REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_PUBLIC_KEY.');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    try {
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email,
        },
        PUBLIC_KEY
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel = isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent!' : 'Send Message';
  const buttonDisabled = isSubmitting || submitStatus === 'success';

  return (
    <section id="contact" className="section">
      <div className="section-content">
        <h2 className="section-title">Contact Me</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              required 
              disabled={submitStatus === 'success'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
              disabled={submitStatus === 'success'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleInputChange}
              required 
              disabled={submitStatus === 'success'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5" 
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={submitStatus === 'success'}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={buttonDisabled}
          >
            {buttonLabel}
          </button>
          {submitStatus === 'error' && (
            <p style={{ color: 'red', marginTop: '1rem' }}>Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
