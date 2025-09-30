import Navbar from './../NavbarComponent/Navbar';
import "./Contact.css";

const Contact = () => {
    return (
        <>
            <Navbar />
            <div className="contact-container">
                <h1 className="contact-heading">Get in Touch</h1>
                <p className="contact-subheading">
                    We'd love to hear from you! Whether you have questions, suggestions, or feedback, reach out to us via any of the channels below.
                </p>

                <div className="contact-cards">
                    <div className="contact-card">
                        <h2>Email</h2>
                        <p>
                            <a href="mailto:sivaprasad111222333@gmail.com" className="contact-link">
                                sivaprasad111222333@gmail.com
                            </a>
                        </p>
                    </div>

                    <div className="contact-card">
                        <h2>Phone</h2>
                        <p>
                            <a href="tel:+916305168684" className="contact-link">
                                +91 6305168684
                            </a>
                        </p>
                    </div>

                    <div className="contact-card">
                        <h2>Location</h2>
                        <p>Chirala, Andhra Pradesh, India</p>
                    </div>
                </div>

                <form className="contact-form">
                    <h2>Send Us a Message</h2>
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </>
    );
};

export default Contact;
