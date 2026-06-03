'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback?: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

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
  email?: string;
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
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const [resetSuccess] = useState(() => queryParams?.get('reset') === 'success');
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(() => queryParams?.get('googleError') || '');
  const [authLoading, setAuthLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [tab, setTab] = useState<'reservations' | 'orders' | 'contacts' | 'menu'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/auth', { cache: 'no-store' });
      setIsAuthed(res.ok);
    } catch {
      setIsAuthed(false);
    }
  }

  async function loadDataForTab(activeTab: 'reservations' | 'orders' | 'contacts' | 'menu') {
    setLoading(true);
    try {
      if (activeTab === 'reservations') {
        const res = await fetch('/api/reservations');
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else if (activeTab === 'contacts') {
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

  useEffect(() => {
    void checkAuth(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (isAuthed) {
      void loadDataForTab(tab); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [isAuthed, tab]);

  function handleTabChange(nextTab: 'reservations' | 'orders' | 'contacts' | 'menu') {
    setTab(nextTab);
    setSearch('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  }

  useEffect(() => {
    if (!googleClientId || isAuthed !== false) {
      return;
    }

    let cancelled = false;

    const initializeGoogle = () => {
      if (cancelled || !window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          const credential = response.credential || '';
          if (!credential) {
            setAuthError('Google sign-in failed. Please try again.');
            return;
          }

          setGoogleLoading(true);
          setAuthError('');

          try {
            const res = await fetch('/api/admin/google-auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential }),
            });

            if (!res.ok) {
              const payload = await res.json().catch(() => ({}));
              const errorMessage =
                typeof payload?.details === 'string'
                  ? payload.details
                  : typeof payload?.error === 'string'
                    ? payload.error
                    : 'Google sign-in is not allowed for this account.';
              setAuthError(errorMessage);
              return;
            }

            setIsAuthed(true);
          } catch {
            setAuthError('Google sign-in failed. Please try again.');
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      const button = document.getElementById('google-signin-button');
      if (!button) {
        return;
      }

      button.innerHTML = '';
      window.google.accounts.id.renderButton(button, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 320,
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return () => {
        cancelled = true;
      };
    }

    const scriptId = 'google-identity-services';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle);
      return () => {
        cancelled = true;
        existingScript.removeEventListener('load', initializeGoogle);
      };
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.onload = null;
    };
  }, [googleClientId, isAuthed]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setAuthError('Invalid username or password.');
        return;
      }
      setIsAuthed(true);
      setPassword('');
    } catch {
      setAuthError('Failed to login. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } finally {
      setIsAuthed(false);
      setUsername('');
      setPassword('');
      setAuthError('');
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (!res.ok) {
        throw new Error('Forgot password request failed');
      }

      setForgotMessage('If the account exists, a reset link has been sent to your email.');
    } catch {
      setForgotMessage('Unable to process request right now. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const apiPath = tab === 'reservations' ? '/api/reservations' : tab === 'orders' ? '/api/orders' : '/api/contacts';
    setUpdatingId(id);
    try {
      const res = await fetch(apiPath, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      await loadDataForTab(tab);
      return true;
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update status. Please try again.');
      return false;
    } finally {
      setUpdatingId(null);
    }
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildBrandedHtmlEmail(params: {
    title: string;
    greeting: string;
    intro: string;
    details: Array<{ label: string; value: string }>;
    highlight: string;
  }) {
    const detailsRows = params.details
      .map(
        (detail) => `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 34%; vertical-align: top; font-size: 14px;">${escapeHtml(detail.label)}</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 700; vertical-align: top; font-size: 14px;">${escapeHtml(detail.value)}</td>
          </tr>
        `
      )
      .join('');

    return `
      <div style="margin:0;padding:0;background:#f6f1ea;">
        <div style="max-width:680px;margin:0 auto;padding:24px 16px;font-family:Arial,sans-serif;color:#1f2937;">
          <div style="background:#1a1a1a;border-radius:22px;padding:30px 28px;color:#fff;">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(244,162,41,0.18);color:#ffd08a;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">SSR Restaurant</div>
            <h1 style="margin:18px 0 10px;font-family:Georgia,serif;font-size:32px;line-height:1.15;color:#fff;">${escapeHtml(params.title)}</h1>
          </div>
          <div style="background:#fff;border-radius:20px;margin-top:18px;padding:26px 24px;box-shadow:0 12px 28px rgba(0,0,0,0.08);">
            <p style="margin:0 0 12px;font-size:16px;color:#111827;">${escapeHtml(params.greeting)}</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#374151;">${escapeHtml(params.intro)}</p>
            <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:10px;">${detailsRows}</table>
            <div style="margin:18px 0 0;padding:14px 16px;border-left:4px solid #f4a229;background:rgba(244,162,41,0.12);color:#111827;border-radius:12px;font-size:14px;line-height:1.65;">${escapeHtml(params.highlight)}</div>
          </div>
          <div style="text-align:center;color:#6b7280;font-size:12px;line-height:1.7;padding:18px 8px 4px;">
            <div style="font-weight:700;color:#111827;margin-bottom:4px;">SSR Restaurant</div>
            <div>Opposite MRO Office, Beside Venkataramana Theatre, Main Road, Kaikalur, Andhra Pradesh, 521333</div>
            <div>Phone: +91 9491437799 · Email: ssrrestaurant007@gmail.com</div>
          </div>
        </div>
      </div>
    `;
  }

  async function copyRichHtmlTemplate(html: string, plainText: string) {
    const plainFallback = plainText;

    // Best path: write both HTML and plain text mime types.
    try {
      if (navigator.clipboard && 'ClipboardItem' in window) {
        const item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plainFallback], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
        alert('Branded template copied. In Gmail body, paste with Ctrl+V (not Ctrl+Shift+V) to keep styling.');
        return;
      }
    } catch {
      // Continue to legacy fallback.
    }

    // Legacy rich-text fallback for browsers where ClipboardItem is restricted.
    try {
      const container = document.createElement('div');
      container.setAttribute('contenteditable', 'true');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.opacity = '0';
      container.innerHTML = html;
      document.body.appendChild(container);

      const selection = window.getSelection();
      if (!selection) {
        throw new Error('No selection API');
      }

      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(container);
      selection.addRange(range);

      const copied = document.execCommand('copy');
      selection.removeAllRanges();
      container.remove();

      if (copied) {
        alert('Branded template copied. In Gmail body, paste with Ctrl+V (not Ctrl+Shift+V) to keep styling.');
        return;
      }
    } catch {
      // Continue to plain text fallback.
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(plainFallback);
      }
      alert('Copied plain text fallback. If formatting is needed, use Ctrl+V in Gmail or send this plain version.');
    } catch {
      alert('Could not copy automatically. Gmail draft is open; please type or paste manually.');
    }
  }

  function openGmailDraft(to: string | undefined, subject: string, body: string) {
    if (!to || !to.includes('@')) {
      alert('Status updated, but customer email is missing. Please contact customer by phone.');
      return;
    }

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function handleReservationDecision(reservation: Reservation, status: 'confirmed' | 'cancelled') {
    const ok = await updateStatus(reservation._id, status);
    if (!ok) return;

    const subject = status === 'confirmed'
      ? 'SSR Reservation Confirmed'
      : 'SSR Reservation Cancelled';
    const body = status === 'confirmed'
      ? `Dear ${reservation.firstName} ${reservation.lastName},\n\nYour reservation request at SSR Restaurant has been confirmed.\n\nDate: ${new Date(reservation.date).toLocaleDateString()}\nTime: ${reservation.time}\nGuests: ${reservation.guests}\n\nIf you need any changes, please reply to this email or call us at +91 9491437799.\n\nRegards,\nSSR Restaurant`
      : `Dear ${reservation.firstName} ${reservation.lastName},\n\nWe regret to inform you that your reservation request at SSR Restaurant has been cancelled.\n\nRequested Date: ${new Date(reservation.date).toLocaleDateString()}\nRequested Time: ${reservation.time}\n\nPlease contact us at +91 9491437799 and we will help you with an alternate slot.\n\nRegards,\nSSR Restaurant`;

    const html = buildBrandedHtmlEmail({
      title: status === 'confirmed' ? 'Reservation Confirmed' : 'Reservation Cancelled',
      greeting: `Dear ${reservation.firstName} ${reservation.lastName},`,
      intro: status === 'confirmed'
        ? 'Your reservation request at SSR Restaurant has been confirmed with the details below.'
        : 'We regret to inform you that your reservation request at SSR Restaurant has been cancelled.',
      details: [
        { label: 'Date', value: new Date(reservation.date).toLocaleDateString() },
        { label: 'Time', value: reservation.time },
        { label: 'Guests', value: `${reservation.guests}` },
        { label: 'Status', value: status === 'confirmed' ? 'Confirmed' : 'Cancelled' },
      ],
      highlight: status === 'confirmed'
        ? 'If you need any changes, reply to this email or call +91 9491437799.'
        : 'For an alternate slot, call +91 9491437799 and our team will assist you.',
    });

    openGmailDraft(reservation.email, subject, body);
    void copyRichHtmlTemplate(html, body);
  }

  async function handleOrderDecision(order: Order, status: 'confirmed' | 'cancelled') {
    const ok = await updateStatus(order._id, status);
    if (!ok) return;

    const subject = status === 'confirmed'
      ? 'SSR Order Confirmed'
      : 'SSR Order Cancelled';
    const body = status === 'confirmed'
      ? `Dear ${order.fullName},\n\nYour order request at SSR Restaurant has been confirmed.\n\nOrder ID: ${order._id}\nAmount: Rs. ${order.amount}\n\nWe will proceed with preparation shortly. For support, call us at +91 9491437799.\n\nRegards,\nSSR Restaurant`
      : `Dear ${order.fullName},\n\nWe regret to inform you that your order request at SSR Restaurant has been cancelled.\n\nOrder ID: ${order._id}\n\nIf this was unexpected, please contact us at +91 9491437799 and we will assist you.\n\nRegards,\nSSR Restaurant`;

    const html = buildBrandedHtmlEmail({
      title: status === 'confirmed' ? 'Order Confirmed' : 'Order Cancelled',
      greeting: `Dear ${order.fullName},`,
      intro: status === 'confirmed'
        ? 'Your order request at SSR Restaurant has been confirmed with the details below.'
        : 'We regret to inform you that your order request at SSR Restaurant has been cancelled.',
      details: [
        { label: 'Order ID', value: order._id },
        { label: 'Amount', value: `₹${order.amount}` },
        { label: 'Status', value: status === 'confirmed' ? 'Confirmed' : 'Cancelled' },
      ],
      highlight: status === 'confirmed'
        ? 'We will begin preparation shortly. For support, call +91 9491437799.'
        : 'For assistance or to place a fresh order, call +91 9491437799.',
    });

    openGmailDraft(order.email, subject, body);
    void copyRichHtmlTemplate(html, body);
  }

  const reservationStatuses = ['all', 'pending', 'confirmed', 'cancelled'];
  const orderStatuses = ['all', 'pending', 'confirmed', 'cancelled'];
  const contactStatuses = ['all', 'new', 'read', 'replied'];
  const statusOptions = tab === 'reservations' ? reservationStatuses : tab === 'orders' ? orderStatuses : contactStatuses;

  function inDateRange(dateValue: string) {
    const target = new Date(dateValue);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (target < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (target > to) return false;
    }
    return true;
  }

  const filteredReservations = reservations.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesDate = inDateRange(r.createdAt);
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    const aPending = a.status === 'pending' ? 0 : 1;
    const bPending = b.status === 'pending' ? 0 : 1;
    if (aPending !== bPending) {
      return aPending - bPending;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch = o.fullName.toLowerCase().includes(q) || o.phone.includes(search) || o.deliveryAddress.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesDate = inDateRange(o.createdAt);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.message.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesDate = inDateRange(c.createdAt);
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isAuthed === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center text-gray-600">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-3xl font-serif mb-2" style={{ color: '#b5451b' }}>Admin Login</h1>
          <p className="text-sm text-gray-600 mb-6">Enter username and password to access admin dashboard.</p>
          {resetSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Password reset complete. Please login with your new password.
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
            {authError && <p className="text-red-600 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-lg px-4 py-2 text-white font-bold"
              style={{ background: authLoading ? '#999' : '#b5451b' }}
            >
              {authLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {googleClientId && (
            <>
              <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
                <span className="h-px flex-1 bg-gray-200" />
                <span>OR</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div id="google-signin-button" />
                {!googleReady && <p className="text-xs text-gray-500">Loading Google sign-in...</p>}
                {googleLoading && <p className="text-xs text-gray-500">Verifying Google account...</p>}
              </div>
            </>
          )}

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword((prev) => !prev)}
              className="text-sm font-semibold text-[#b5451b] underline"
            >
              Forgot password?
            </button>
          </div>

          {showForgotPassword && (
            <div className="mt-4 rounded-lg border border-[#f4d6c8] bg-[#fff8f4] p-4 text-sm text-[#6a3a24]">
              <p className="font-semibold mb-1">Password recovery</p>
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Admin email"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full rounded-lg px-4 py-2 text-white font-bold"
                  style={{ background: forgotLoading ? '#999' : '#b5451b' }}
                >
                  {forgotLoading ? 'Sending link...' : 'Send reset link'}
                </button>
              </form>
              {forgotMessage && <p className="mt-3 text-xs">{forgotMessage}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-serif mb-2" style={{ color: '#b5451b' }}>Admin Panel</h1>
              <p className="text-gray-600">Manage reservations, orders, contacts, and menu items</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-[#b5451b] text-[#b5451b] font-bold text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['reservations', 'orders', 'contacts', 'menu'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
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
          {tab !== 'menu' && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tab === 'contacts' ? 'Search name, email, subject, message…' : 'Search name, email, phone…'}
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : tab === 'reservations' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reservations ({filteredReservations.length})</h2>
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
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((r) => (
                      <tr key={r._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold">{r.firstName} {r.lastName}</td>
                        <td className="px-4 py-2">{r.email}</td>
                        <td className="px-4 py-2">{r.phone}</td>
                        <td className="px-4 py-2">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{r.time}</td>
                        <td className="px-4 py-2">{r.guests}</td>
                        <td className="px-4 py-2">
                          <select
                            value={r.status}
                            onChange={(e) => updateStatus(r._id, e.target.value)}
                            disabled={updatingId === r._id}
                            className="border rounded px-2 py-1 text-xs font-bold"
                          >
                            {reservationStatuses.filter((s) => s !== 'all').map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          {r.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReservationDecision(r, 'confirmed')}
                                disabled={updatingId === r._id}
                                className="text-xs px-2 py-1 rounded border border-green-600 text-green-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleReservationDecision(r, 'cancelled')}
                                disabled={updatingId === r._id}
                                className="text-xs px-2 py-1 rounded border border-red-600 text-red-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'orders' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Orders ({filteredOrders.length})</h2>
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
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold">{o.fullName}</td>
                        <td className="px-4 py-2">{o.phone}</td>
                        <td className="px-4 py-2 text-xs">{o.deliveryAddress.substring(0, 30)}...</td>
                        <td className="px-4 py-2 font-bold">₹{o.amount}</td>
                        <td className="px-4 py-2">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            disabled={updatingId === o._id}
                            className="border rounded px-2 py-1 text-xs font-bold"
                          >
                            {orderStatuses.filter((s) => s !== 'all').map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          {o.status === 'pending' ? (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleOrderDecision(o, 'confirmed')}
                                disabled={updatingId === o._id}
                                className="text-xs px-2 py-1 rounded border border-green-600 text-green-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleOrderDecision(o, 'cancelled')}
                                disabled={updatingId === o._id}
                                className="text-xs px-2 py-1 rounded border border-red-600 text-red-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'contacts' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Submissions ({filteredContacts.length})</h2>
              <div className="space-y-4">
                {filteredContacts.map((c) => (
                  <div key={c._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{c.name}</h3>
                        <p className="text-sm text-gray-600">{c.email}</p>
                      </div>
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                        disabled={updatingId === c._id}
                        className="border rounded px-2 py-1 text-xs font-bold"
                      >
                        {contactStatuses.filter((s) => s !== 'all').map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-sm mb-2"><strong>Subject:</strong> {c.subject}</p>
                    <p className="text-sm text-gray-700">{c.message}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateStatus(c._id, 'read')}
                        disabled={updatingId === c._id}
                        className="text-xs px-2 py-1 rounded border border-blue-600 text-blue-700"
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={() => updateStatus(c._id, 'replied')}
                        disabled={updatingId === c._id}
                        className="text-xs px-2 py-1 rounded border border-green-600 text-green-700"
                      >
                        Mark Replied
                      </button>
                    </div>
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
