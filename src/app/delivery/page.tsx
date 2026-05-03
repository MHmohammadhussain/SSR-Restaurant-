'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';

const steps = [
  { num: '1', title: 'Choose Your Dishes', desc: 'Browse our extensive menu and pick your favourite Andhra classics.' },
  { num: '2', title: 'Place Your Order', desc: 'Order directly on our site or via Swiggy / Zomato.' },
  { num: '3', title: 'We Prepare Fresh', desc: 'Our chefs cook your order fresh using authentic recipes and spices.' },
  { num: '4', title: 'Delivered to You', desc: 'Our delivery partners bring the food hot and on time to your door.' },
];

const info = [
  { icon: '📍', title: 'Delivery Zone', desc: 'We deliver within a 10 km radius of our restaurant in Banjara Hills, Hyderabad.' },
  { icon: '⏱️', title: 'Delivery Time', desc: 'Average delivery time is 45–60 minutes. During peak hours it may take up to 75 minutes.' },
  { icon: '💰', title: 'Minimum Order', desc: 'Minimum order value for delivery is ₹250. Free delivery on orders above ₹500.' },
  { icon: '📦', title: 'Packaging', desc: 'We use eco-friendly packaging that keeps your food fresh and hot during transit.' },
];

export default function DeliveryPage() {
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
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        deliveryAddress: formData.get('deliveryAddress'),
        pinCode: formData.get('pinCode'),
        orderDescription: formData.get('orderDescription'),
        paymentMethod: formData.get('paymentMethod'),
        preferredTime: formData.get('preferredTime') || '',
        specialInstructions: formData.get('specialInstructions') || '',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Delivery Hero */}
      <div className="pt-36 pb-20 text-center" style={{ background: 'linear-gradient(135deg,#1a1a1a 50%,#b5451b)' }}>
        <h1 className="font-serif text-5xl text-white mb-3">Order Online</h1>
        <p className="text-white/80 text-lg max-w-lg mx-auto mb-8">
          Authentic Andhra flavours delivered hot to your doorstep — wherever you are in the city.
        </p>
        <Link href="/menu" className="btn btn-primary text-lg px-8 py-4">Browse Menu &amp; Order</Link>
        <div className="flex gap-4 justify-center flex-wrap mt-6">
          {[{ emoji: '🟠', label: 'Swiggy' }, { emoji: '🔴', label: 'Zomato' }, { emoji: '🟢', label: 'Direct Order' }].map((a) => (
            <a
              key={a.label}
              href="#order-form"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-colors hover:bg-[#b5451b]"
              style={{ background: '#1a1a1a' }}
            >
              <span>{a.emoji}</span> {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Get your favourite Andhra food in 4 easy steps</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {steps.map((s) => (
            <div key={s.num} className="text-center bg-white rounded-xl p-8 shadow-sm">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4"
                style={{ background: '#b5451b' }}
              >
                {s.num}
              </div>
              <h3 className="font-serif text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-[#777]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="section-title">Place a Direct Order</h2>
          <p className="section-subtitle">Order directly with us for the best prices — no platform fees</p>
          <div className="bg-[#fdf6ec] rounded-xl p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <h4 className="font-serif text-xl mb-2">Order Placed!</h4>
                <p className="text-[#555] text-sm">We&apos;ll call you within 10 minutes to confirm. Estimated delivery: 45–60 min.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label>Full Name *</label><input type="text" name="fullName" placeholder="Your name" required /></div>
                  <div className="form-group"><label>Phone *</label><input type="tel" name="phone" placeholder="+91 98765 43210" required /></div>
                </div>
                <div className="form-group"><label>Delivery Address *</label><textarea name="deliveryAddress" placeholder="Full address including flat no., street, area…" required style={{ minHeight: '80px' }} /></div>
                <div className="form-group"><label>PIN Code *</label><input type="text" name="pinCode" placeholder="500034" maxLength={6} pattern="[0-9]{6}" required /></div>
                <div className="form-group"><label>Your Order *</label><textarea name="orderDescription" placeholder="e.g. 2x Andhra Chicken Curry, 1x Biryani, 2x Pesarattu…" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Payment Method *</label>
                    <select name="paymentMethod" required defaultValue="">
                      <option value="" disabled>Select</option>
                      {['cash', 'upi', 'credit_card'].map((o) => <option key={o} value={o}>{o === 'cash' ? 'Cash on Delivery' : o === 'upi' ? 'UPI (GPay / PhonePe)' : 'Card on Delivery'}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Preferred Delivery Time</label><input type="time" name="preferredTime" /></div>
                </div>
                <div className="form-group"><label>Special Instructions</label><textarea name="specialInstructions" placeholder="Extra spicy, no onion, extra chutney…" style={{ minHeight: '70px' }} /></div>
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full font-bold text-white text-base transition-colors cursor-pointer border-none"
                  style={{ background: loading ? '#999' : '#b5451b' }}
                >
                  {loading ? 'Placing order…' : 'Place Order 🚚'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="section-title">Delivery Info</h2>
        <p className="section-subtitle">Everything you need to know about our delivery service</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {info.map((i) => (
            <div key={i.title} className="text-center bg-white rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">{i.icon}</div>
              <h3 className="font-serif text-lg mb-2">{i.title}</h3>
              <p className="text-sm text-[#777]">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
