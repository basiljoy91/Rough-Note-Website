import {
  ArrowRight,
  CalendarDays,
  Heart,
  Mail,
  MapPin,
  Navigation,
  Paperclip,
  Phone,
  Send,
  Smile
} from 'lucide-react';
import { SiteLayout } from '../../app/layouts/SiteLayout';
import { NotebookPageTransition } from '../../shared/navigation/NotebookPageTransition';
import './ConnectPage.css';

const studioAddress =
  '8th Floor, KRM Plaza, South Tower, South Tower, 2, Harrington Rd, Chetpet, Chennai, Greater Chennai, Tamil Nadu 600031';

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `Rough Note, ${studioAddress}`
)}`;

export function ConnectPage() {
  return (
    <SiteLayout activeItem="contact" pageLabel="Page 09" pageTitle="Let's Connect">
      <div className="connect-page-wrapper">
        <main className="notebook-spread" aria-label="Rough Note contact page">
          <NotebookPageTransition pageSelector=".notebook-spread" />

          <header className="connect-hero">
            <div className="connect-page-number">Page 09 <span aria-hidden="true">☆</span></div>
            <h1>Let&apos;s Connect</h1>
            <div className="connect-heading-line" aria-hidden="true" />
            <p>
              Got an idea, a project, or just want to say hello?<br />
              We&apos;d <span className="circled-word">love</span> to hear from you. <Heart aria-hidden="true" />
            </p>
          </header>

          <aside className="conversation-note" aria-label="Good ideas start with a conversation">
            <span className="paper-tape" aria-hidden="true" />
            <p>Good ideas<br />start with a<br /><span>conversation.</span></p>
            <Smile aria-hidden="true" />
          </aside>

          <div className="contact-coffee-photo" aria-hidden="true">
            <img src="/assets/images/connect-page-reference.jpg" alt="" />
          </div>

          <section className="contact-paper contact-call-card" aria-labelledby="call-us-title">
            <span className="contact-paperclip" aria-hidden="true"><Paperclip /></span>
            <div className="contact-card-title">
              <Phone aria-hidden="true" />
              <h2 id="call-us-title">Call Us</h2>
            </div>
            <a className="contact-primary" href="tel:+919876543210">+91 98765 43210</a>
            <div className="contact-dash" />
            <p>Mon &ndash; Sat<br />9:00 AM &ndash; 8:00 PM</p>
            <p>Sunday &ndash; <span className="red-underline">Closed</span></p>
          </section>

          <section className="contact-paper contact-email-card" aria-labelledby="email-us-title">
            <span className="contact-pin" aria-hidden="true" />
            <div className="contact-card-title contact-card-title--blue">
              <Mail aria-hidden="true" />
              <h2 id="email-us-title">Email Us</h2>
            </div>
            <a className="contact-primary" href="mailto:hello@roughnote.in">hello@roughnote.in</a>
            <div className="contact-dash" />
            <p>We usually reply<br />within <span className="circled-24">24</span> working<br />hours.</p>
            <Send className="email-plane" aria-hidden="true" />
          </section>

          <section className="contact-paper coffee-meeting-card" aria-labelledby="coffee-title">
            <div className="meeting-copy">
              <h2 id="coffee-title">Let&apos;s Have a Coffee</h2>
              <p>Let&apos;s meet over coffee (virtual or real)<br />and talk about your next idea.</p>
              <a
                href="/html/schedule-step-1.html"
                className="schedule-btn"
                data-notebook-turn
              >
                <CalendarDays aria-hidden="true" />
                <span>Schedule a Meeting</span>
                <ArrowRight aria-hidden="true" />
              </a>
              <div className="meeting-prompt"><span aria-hidden="true">↗</span> Pick a time that works for you.</div>
            </div>
            <div className="tiny-coffee-sketch" aria-hidden="true">
              <span className="steam steam-one" />
              <span className="steam steam-two" />
              <span className="cup-rim" />
              <span className="cup-body" />
              <span className="cup-handle" />
              <span className="cup-saucer" />
              <Heart />
            </div>
          </section>

          <aside className="contact-margin-note" aria-label="Ideas become plans. Plans become products.">
            <p>Ideas<br />become<br />plans.</p>
            <p>Plans<br />become<br />products.</p>
            <span aria-hidden="true">☆</span>
          </aside>

          <section className="studio-paper" aria-labelledby="studio-title">
            <span className="studio-tape" aria-hidden="true" />
            <div className="studio-copy">
              <div className="studio-title-row">
                <MapPin aria-hidden="true" />
                <div>
                  <p className="studio-brand">Rough Note</p>
                  <h2 id="studio-title">Our Studio</h2>
                </div>
              </div>
              <address>{studioAddress}</address>
              <div className="contact-dash" />
              <p>We&apos;re always happy to meet in person. Let&apos;s <span className="red-underline">create</span> something meaningful together.</p>
              <Smile className="studio-smile" aria-hidden="true" />
            </div>

            <div className="studio-map" aria-label="Map showing the Rough Note studio in Chetpet, Chennai">
              <img src="/assets/images/rough-note-map-reference.jpg" alt="Rough Note studio location in Chetpet, Chennai" />
              <span className="map-paper-label"><MapPin aria-hidden="true" /> Rough Note</span>
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="directions-note">
                <Navigation aria-hidden="true" />
                <span>Get Directions</span>
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </section>
        </main>
      </div>
    </SiteLayout>
  );
}
