import '../assets/css/Contact.css';

export default function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">We’d love to hear from you! Send us a message below.</p>

        <form className="contact-form">
          <label className="contact-label" htmlFor="name">
            Full Name
          </label>
          <input type="text" id="name" placeholder="John Doe" className="contact-input" />

          <label className="contact-label" htmlFor="email">
            Email
          </label>
          <input type="email" id="email" placeholder="you@example.com" className="contact-input" />

          <label className="contact-label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Write your message here..."
            className="contact-input contact-textarea"
          />

          <button type="submit" className="contact-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
