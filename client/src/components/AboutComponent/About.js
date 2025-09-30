import './About.css'
const About = () => (
  <div className="about-container">
    <h2 className="about-title">About Me</h2>
    <p className="about-text">
      Hi, I’m <strong>Venkata Siva Prasad</strong>.  
      I am passionate about technology, web development, and building applications that make life easier.  
      Feel free to reach out to me through the details below:
    </p>

    <div className="about-info">
      <p><strong>📞 Phone:</strong> 6305168684</p>
      <p><strong>📧 Email:</strong> <a href="mailto:sivaprasad111222333@gmail.com">sivaprasad111222333@gmail.com</a></p>
      <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/6305168684" target="_blank" rel="noopener noreferrer">6305168684</a></p>
    </div>
  </div>
);

export default About;
