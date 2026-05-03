'use client';

import { useState, useEffect } from 'react';

interface Reservation {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  createdAt: string;
}

interface Order {
  _id: string;
  fullName: string;
  phone: string;
  deliveryAddress: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [tab, setTab] = useState<'reservations' | 'orders' | 'contacts' | 'menu'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === 'reservations') {
        const res = await fetch('/api/reservations');
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      } else if (tab === 'orders') {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else if (tab === 'contacts') {
        const res = await fetch('/api/contacts');
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-4xl font-serif mb-2" style={{ color: '#b5451b' }}>Admin Panel</h1>
          <p className="text-gray-600">Manage reservations, orders, contacts, and menu items</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['reservations', 'orders', 'contacts', 'menu'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                tab === t
                  ? 'bg-white text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              style={{ background: tab === t ? '#b5451b' : '#fff', color: tab === t ? '#fff' : '#333' }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : tab === 'reservations' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reservations ({reservations.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Guests</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold">{r.firstName} {r.lastName}</td>
                        <td className="px-4 py-2">{r.email}</td>
                        <td className="px-4 py-2">{r.phone}</td>
                        <td className="px-4 py-2">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{r.time}</td>
                        <td className="px-4 py-2">{r.guests}</td>
                        <td className="px-4 py-2">
                          <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ background: '#b5451b' }}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'orders' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Orders ({orders.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold">{o.fullName}</td>
                        <td className="px-4 py-2">{o.phone}</td>
                        <td className="px-4 py-2 text-xs">{o.deliveryAddress.substring(0, 30)}...</td>
                        <td className="px-4 py-2 font-bold">₹{o.amount}</td>
                        <td className="px-4 py-2">
                          <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ background: '#b5451b' }}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'contacts' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Submissions ({contacts.length})</h2>
              <div className="space-y-4">
                {contacts.map((c) => (
                  <div key={c._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{c.name}</h3>
                        <p className="text-sm text-gray-600">{c.email}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ background: '#b5451b' }}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm mb-2"><strong>Subject:</strong> {c.subject}</p>
                    <p className="text-sm text-gray-700">{c.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Menu management coming soon</p>
              <p className="text-gray-400 text-sm mt-2">You can manage menu items via API or add a menu editor interface here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
