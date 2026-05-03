'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    let valid = true;
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]').forEach((f) => {
      if (!f.value.trim()) { f.style.borderColor = '#b5451b'; valid = false; }
      else f.style.borderColor = '';
    });
    if (!valid) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone') || '',
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      };

      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">Contact Us</h1>
        <p className="text-white/70 text-lg">We&apos;d love to hear from you</p>
      </div>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <h3 className="font-serif text-2xl mb-6">Get in Touch</h3>
            {[
              { icon: '📍', label: 'Address', text: '123 Spice Lane, Banjara Hills,\nHyderabad, Telangana – 500034' },
              { icon: '📞', label: 'Phone', text: '+91 98765 43210\n+91 87654 32109' },
              { icon: '✉️', label: 'Email', text: 'hello@ssrrestaurant.com\nreservations@ssrrestaurant.com' },
              { icon: '🕐', label: 'Hours', text: 'Mon–Thu: 11 AM – 10 PM\nFri–Sat: 11 AM – 11 PM\nSun: 12 PM – 10 PM' },
            ].map((d) => (
              <div key={d.label} className="flex gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#b5451b' }}
                >
                  {d.icon}
                </div>
                <div>
                  <strong className="block text-sm mb-1">{d.label}</strong>
                  <span className="text-[#777] text-sm whitespace-pre-line">{d.text}</span>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div
              className="rounded-xl h-64 flex items-center justify-center text-7xl mt-6 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#2d7a35,#a4d86e)' }}
            >
              🗺️
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <h3 className="font-serif text-2xl text-center mb-7">Send a Message</h3>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="font-serif text-xl mb-2">Message Sent!</h4>
                <p className="text-[#555] text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label>Name *</label><input type="text" name="name" placeholder="Your name" required /></div>
                  <div className="form-group"><label>Phone</label><input type="tel" name="phone" placeholder="+91 98765 43210" /></div>
                </div>
                <div className="form-group"><label>Email *</label><input type="email" name="email" placeholder="you@example.com" required /></div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select name="subject" required defaultValue="">
                    <option value="" disabled>Select a subject</option>
                    {['general', 'catering', 'events', 'feedback'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Message *</label><textarea name="message" placeholder="How can we help you?" required /></div>
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full font-bold text-white text-base transition-colors cursor-pointer border-none"
                  style={{ background: loading ? '#999' : '#b5451b' }}
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
