'use client';

import { useState, FormEvent } from 'react';

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]');
    let valid = true;
    inputs.forEach((f) => {
      if (!f.value.trim()) { f.style.borderColor = '#b5451b'; valid = false; }
      else f.style.borderColor = '';
    });
    if (!valid) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        occasion: formData.get('occasion') || '',
        specialRequests: formData.get('specialRequests') || '',
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to book reservation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 60%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-2">Reservations</h1>
        <p className="text-white/70 text-lg">Book your table and let us take care of the rest</p>
      </div>

      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <h2 className="left-title">Plan Your Visit</h2>
            <p className="text-[#555] mb-6">We welcome walk-ins but recommend booking in advance — especially on weekends. Fill in the form and we&apos;ll confirm your reservation within 2 hours.</p>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <h4 className="font-bold mb-4" style={{ color: '#b5451b' }}>Opening Hours</h4>
              <table className="w-full text-sm">
                <tbody>
                  {[['Monday – Thursday', '11 AM – 10 PM'], ['Friday – Saturday', '11 AM – 11 PM'], ['Sunday', '12 PM – 10 PM']].map(([day, hrs]) => (
                    <tr key={day} className="border-b border-gray-100">
                      <td className="py-2">{day}</td>
                      <td className="py-2 text-right font-bold">{hrs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-bold mb-3" style={{ color: '#b5451b' }}>Private Events</h4>
              <p className="text-[#555] text-sm">Hosting a birthday, anniversary or corporate event? We offer exclusive dining packages. Call us at <strong>+91 98765 43210</strong> to discuss your requirements.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <h3 className="font-serif text-2xl text-center mb-7">Book a Table</h3>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h4 className="font-serif text-xl mb-2">Reservation Confirmed!</h4>
                <p className="text-[#555] text-sm">We&apos;ll send a confirmation to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label>First Name *</label><input type="text" name="firstName" placeholder="Ravi" required /></div>
                  <div className="form-group"><label>Last Name *</label><input type="text" name="lastName" placeholder="Kumar" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label>Email *</label><input type="email" name="email" placeholder="ravi@example.com" required /></div>
                  <div className="form-group"><label>Phone *</label><input type="tel" name="phone" placeholder="+91 98765 43210" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label>Date *</label><input type="date" name="date" min={today} required /></div>
                  <div className="form-group"><label>Time *</label><input type="time" name="time" min="11:00" max="22:30" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Guests *</label>
                    <select name="guests" required defaultValue="">
                      <option value="" disabled>Select</option>
                      {['1 Person','2 People','3 People','4 People','5–6 People','7–10 People','10+ People'].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Occasion</label>
                    <select name="occasion" defaultValue="">
                      <option value="">None</option>
                      {['Birthday','Anniversary','Business Meal','Other'].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Special Requests</label><textarea name="specialRequests" placeholder="Dietary requirements, seating preferences…" /></div>
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full font-bold text-white text-base transition-colors cursor-pointer border-none"
                  style={{ background: loading ? '#999' : '#b5451b' }}
                >
                  {loading ? 'Booking…' : 'Confirm Reservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
