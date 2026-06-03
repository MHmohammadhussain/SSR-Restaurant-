'use client';

import { clearDeliveryCart, readDeliveryCart, writeDeliveryCart } from '@/lib/deliveryCart';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, FormEvent } from 'react';

type RawCatalogItem = { name: string; price: number; category: string };
type DietFilter = 'all' | 'veg' | 'nonveg';
type CatalogItem = RawCatalogItem & { diet: Exclude<DietFilter, 'all'>; image: string };

const RAW_MENU_CATALOG: RawCatalogItem[] = [
  { category: 'biryani_nonveg', name: 'Egg Biryani', price: 180 },
  { category: 'biryani_nonveg', name: 'Chicken Fry Biryani', price: 220 },
  { category: 'biryani_nonveg', name: 'Chicken Liver Biryani', price: 240 },
  { category: 'biryani_nonveg', name: 'Chicken Dum Biryani', price: 230 },
  { category: 'biryani_nonveg', name: 'Chicken Mixed Biryani', price: 240 },
  { category: 'biryani_nonveg', name: 'S.P Chicken Pulav', price: 230 },
  { category: 'biryani_nonveg', name: 'Chicken Moghlai', price: 250 },
  { category: 'biryani_nonveg', name: 'Prawns Pulav', price: 260 },
  { category: 'biryani_nonveg', name: 'Prawns Mixed', price: 260 },
  { category: 'biryani_nonveg', name: 'Chicken Joint Pulav', price: 280 },
  { category: 'biryani_nonveg', name: 'Chicken Wings Pulav', price: 280 },
  { category: 'biryani_nonveg', name: 'Chicken Lollipop Biryani', price: 280 },
  { category: 'biryani_nonveg', name: 'All Mixed Biryani', price: 320 },
  { category: 'biryani_nonveg', name: 'Mutton Fry Biryani', price: 340 },
  { category: 'biryani_nonveg', name: 'S.P Mutton Pulav', price: 350 },
  { category: 'biryani_nonveg', name: 'Mutton Dum Biryani', price: 400 },
  { category: 'biryani_nonveg', name: 'Gongura Chicken Biryani', price: 260 },
  { category: 'biryani_nonveg', name: 'Ulavacharu Chicken Biryani', price: 260 },
  { category: 'biryani_nonveg', name: 'Gongura Mutton Biryani', price: 380 },

  { category: 'biryani_veg', name: 'Veg Biryani', price: 170 },
  { category: 'biryani_veg', name: 'S.P Veg Biryani', price: 220 },
  { category: 'biryani_veg', name: 'Kaju Biryani', price: 250 },
  { category: 'biryani_veg', name: 'Mushroom Biryani', price: 220 },
  { category: 'biryani_veg', name: 'Paneer Biryani', price: 220 },
  { category: 'biryani_veg', name: 'Babycorn Biryani', price: 220 },
  { category: 'biryani_veg', name: 'Veg Mixed Biryani', price: 250 },

  { category: 'fried_rice_veg', name: 'Jeera Rice', price: 130 },
  { category: 'fried_rice_veg', name: 'Veg Fried Rice', price: 120 },
  { category: 'fried_rice_veg', name: 'Kaju Fried Rice', price: 250 },
  { category: 'fried_rice_veg', name: 'Veg Mixed Fried Rice', price: 250 },

  { category: 'fried_rice_nonveg', name: 'Egg Fried Rice', price: 140 },
  { category: 'fried_rice_nonveg', name: 'Chicken Fried Rice', price: 220 },
  { category: 'fried_rice_nonveg', name: 'Prawns Fried Rice', price: 260 },
  { category: 'fried_rice_nonveg', name: 'Mixed Fried Rice', price: 320 },
  { category: 'fried_rice_nonveg', name: 'Mutton Fried Rice', price: 350 },

  { category: 'curries_nonveg', name: 'Egg Curry', price: 120 },
  { category: 'curries_nonveg', name: 'Chicken Curry', price: 200 },
  { category: 'curries_nonveg', name: 'Chicken Mughlai', price: 240 },
  { category: 'curries_nonveg', name: 'Prawns Curry', price: 260 },
  { category: 'curries_nonveg', name: 'Butter Chicken', price: 240 },
  { category: 'curries_nonveg', name: 'Chicken Tikka Masala', price: 250 },
  { category: 'curries_nonveg', name: 'Mutton Curry', price: 350 },

  { category: 'curries_veg', name: 'Palak Dal', price: 120 },
  { category: 'curries_veg', name: 'Tomato Curry', price: 100 },
  { category: 'curries_veg', name: 'Green Masala', price: 150 },
  { category: 'curries_veg', name: 'Veg Mixed', price: 150 },
  { category: 'curries_veg', name: 'Palak Paneer', price: 220 },
  { category: 'curries_veg', name: 'Paneer Butter Masala', price: 200 },
  { category: 'curries_veg', name: 'Mushroom Curry', price: 200 },

  { category: 'snacks', name: 'Egg Manchurian', price: 180 },
  { category: 'snacks', name: 'Chilli Chicken', price: 200 },
  { category: 'snacks', name: 'Chicken 65', price: 200 },
  { category: 'snacks', name: 'Chicken Wings', price: 200 },
  { category: 'snacks', name: 'Chicken Lollipop', price: 200 },
  { category: 'snacks', name: 'Prawns Fry', price: 260 },
  { category: 'snacks', name: 'Pepper Chicken', price: 270 },
];

function inferDiet(item: RawCatalogItem): Exclude<DietFilter, 'all'> {
  return item.category.includes('_veg') ? 'veg' : 'nonveg';
}

function getItemImage(item: RawCatalogItem) {
  const name = item.name.toLowerCase();
  if (name.includes('egg biryani')) return '/images/menu/egg-biryani.jpg';
  if (name.includes('chicken fry biryani')) return '/images/menu/chicken-fry-biryani.jpg';
  if (name.includes('chicken liver biryani')) return '/images/menu/chicken-liver-biryani.jpg';
  if (name.includes('chicken dum biryani')) return '/images/menu/chicken-dum-biryani.jpg';
  if (name.includes('chicken mixed biryani')) return '/images/menu/chicken-mixed-biryani.jpg';
  if (name.includes('s.p chicken pulav')) return '/images/menu/s-p-chicken-pulav.jpg';
  if (name.includes('chicken moghlai')) return '/images/menu/chicken-moghlai.jpg';
  if (name.includes('chicken mughlai')) return '/images/menu/chicken-mughlai.jpg';
  if (name.includes('prawns pulav')) return '/images/menu/prawns-pulav.jpg';
  if (name.includes('prawns mixed')) return '/images/menu/prawns-mixed.jpg';
  if (name.includes('chicken joint pulav')) return '/images/menu/chicken-joint-pulav.jpg';
  if (name.includes('chicken wings pulav')) return '/images/menu/chicken-wings-pulav.jpg';
  if (name.includes('chicken lollipop biryani')) return '/images/menu/chicken-lollipop-biryani.jpg';
  if (name.includes('all mixed biryani')) return '/images/menu/all-mixed-biryani.jpg';
  if (name.includes('mutton fry biryani')) return '/images/menu/mutton-fry-biryani.jpg';
  if (name.includes('s.p mutton pulav')) return '/images/menu/s-p-mutton-pulav.jpg';
  if (name.includes('mutton dum biryani')) return '/images/menu/mutton-dum-biryani.jpg';
  if (name.includes('gongura chicken biryani')) return '/images/menu/gongura-chicken-biryani.jpg';
  if (name.includes('ulavacharu chicken biryani')) return '/images/menu/ulavacharu-chicken-biryani.jpg';
  if (name.includes('gongura mutton biryani')) return '/images/menu/gongura-mutton-biryani.jpg';
  if (name.includes('veg biryani')) return '/images/menu/veg-biryani.jpg';
  if (name.includes('s.p veg biryani')) return '/images/menu/s-p-veg-biryani.jpg';
  if (name.includes('kaju biryani')) return '/images/menu/veg-mixed-biryani.jpg';
  if (name.includes('mushroom biryani')) return '/images/menu/veg-mixed-biryani.jpg';
  if (name.includes('paneer biryani')) return '/images/menu/paneer-biryani.jpg';
  if (name.includes('babycorn biryani')) return '/images/menu/babycorn-biryani.jpg';
  if (name.includes('veg mixed biryani')) return '/images/menu/veg-mixed-biryani.jpg';
  if (name.includes('jeera rice')) return '/images/menu/veg-fried-rice.jpg';
  if (name.includes('veg fried rice')) return '/images/menu/veg-fried-rice.jpg';
  if (name.includes('kaju fried rice')) return '/images/menu/veg-mixed-fried-rice.jpg';
  if (name.includes('veg mixed fried rice')) return '/images/menu/veg-mixed-fried-rice.jpg';
  if (name.includes('egg fried rice')) return '/images/menu/egg-fried-rice.jpg';
  if (name.includes('chicken fried rice')) return '/images/menu/chicken-fried-rice.jpg';
  if (name.includes('prawns fried rice')) return '/images/menu/prawns-fried-rice.jpg';
  if (name.includes('mixed fried rice')) return '/images/menu/mixed-fried-rice.jpg';
  if (name.includes('mutton fried rice')) return '/images/menu/mutton-fried-rice.jpg';
  if (name.includes('egg curry')) return '/images/menu/egg-curry.jpg';
  if (name.includes('chicken curry')) return '/images/menu/chicken-curry.jpg';
  if (name.includes('chicken mughlai') || name.includes('chicken moghlai')) return '/images/menu/chicken-mughlai.jpg';
  if (name.includes('prawns curry')) return '/images/menu/prawns-curry.jpg';
  if (name.includes('butter chicken')) return '/images/menu/butter-chicken.jpg';
  if (name.includes('chicken tikka masala')) return '/images/menu/chicken-tikka-masala.jpg';
  if (name.includes('mutton curry')) return '/images/menu/mutton-curry.jpg';
  if (name.includes('palak paneer')) return '/images/menu/palak-paneer.jpg';
  if (name.includes('paneer butter masala')) return '/images/menu/paneer-butter-masala.jpg';
  if (name.includes('mushroom curry')) return '/images/menu/veg-mixed.jpg';
  if (name.includes('egg manchurian')) return '/images/menu/egg-manchurian.jpg';
  if (name.includes('chilli chicken')) return '/images/menu/chilli-chicken.jpg';
  if (name.includes('chicken 65')) return '/images/menu/chicken-65.jpg';
  if (name.includes('chicken wings')) return '/images/menu/chicken-wings.jpg';
  if (name.includes('chicken lollipop')) return '/images/menu/chicken-lollipop.jpg';
  if (name.includes('prawns fry')) return '/images/menu/prawns-fry.jpg';
  if (name.includes('pepper chicken')) return '/images/menu/pepper-chicken.jpg';
  return item.category.includes('veg') ? '/images/menu/veg-biryani.jpg' : '/images/menu/chicken-dum-biryani.jpg';
}

const MENU_CATALOG: CatalogItem[] = RAW_MENU_CATALOG.map((item) => ({
  ...item,
  diet: inferDiet(item),
  image: getItemImage(item),
}));

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  biryani_nonveg: 'Biryani (Non-Veg)',
  biryani_veg: 'Biryani (Veg)',
  fried_rice_veg: 'Fried Rice (Veg)',
  fried_rice_nonveg: 'Fried Rice (Non-Veg)',
  curries_nonveg: 'Curries (Non-Veg)',
  curries_veg: 'Curries (Veg)',
  snacks: 'Snacks',
};

const steps = [
  { num: '1', title: 'Choose Your Dishes', desc: 'Browse our extensive menu and pick your favourite Andhra classics.' },
  { num: '2', title: 'Place Your Order', desc: 'Order directly on our site or via Swiggy / Zomato.' },
  { num: '3', title: 'We Prepare Fresh', desc: 'Our chefs cook your order fresh using authentic recipes and spices.' },
  { num: '4', title: 'Delivered to You', desc: 'Our delivery partners bring the food hot and on time to your door.' },
];

const info = [
  { icon: '📍', title: 'Delivery Zone', desc: 'We deliver within a 10 km radius of our restaurant in Banjara Hills, Hyderabad.' },
  { icon: '⏱️', title: 'Delivery Time', desc: 'Average delivery time is 45–60 minutes. During peak hours it may take up to 75 minutes.' },
  { icon: '💰', title: 'Delivery Charges', desc: 'Free delivery on orders above ₹500. Delivery charges may apply for smaller orders based on distance.' },
  { icon: '📦', title: 'Packaging', desc: 'We use eco-friendly packaging that keeps your food fresh and hot during transit.' },
];

export default function DeliveryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORY_LABELS>('all');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>(() => (typeof window === 'undefined' ? {} : readDeliveryCart()));
  const [recentSelections, setRecentSelections] = useState<string[]>([]);
  const skipInitialSync = useRef(true);

  useEffect(() => {
    if (skipInitialSync.current) {
      skipInitialSync.current = false;
      return;
    }
    writeDeliveryCart(quantities);
  }, [quantities]);

  const filteredMenu = MENU_CATALOG.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesDiet = dietFilter === 'all' || item.diet === dietFilter;
    return matchesCategory && matchesSearch && matchesDiet;
  }).sort((a, b) => {
    const aSelected = (quantities[a.name] || 0) > 0 ? 1 : 0;
    const bSelected = (quantities[b.name] || 0) > 0 ? 1 : 0;
    return bSelected - aSelected;
  });

  const selectedItems = MENU_CATALOG.filter((item) => (quantities[item.name] || 0) > 0).map((item) => ({
    name: item.name,
    price: item.price,
    quantity: quantities[item.name],
    lineTotal: item.price * quantities[item.name],
  }));

  const subtotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const orderDescription = selectedItems
    .map((item) => `${item.quantity}x ${item.name} (₹${item.price})`)
    .join(', ');

  function changeQty(name: string, delta: number) {
    setQuantities((prev) => {
      const nextQty = Math.max(0, (prev[name] || 0) + delta);
      const next = { ...prev };
      if (nextQty === 0) delete next[name];
      else next[name] = nextQty;
      return next;
    });

    if (delta > 0) {
      setRecentSelections((prev) => [name, ...prev.filter((item) => item !== name)].slice(0, 5));
    }
  }

  function clearSelectedItems() {
    clearDeliveryCart();
    setQuantities({});
    setRecentSelections([]);
    setError('');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (selectedItems.length === 0) {
      setError('Please select at least one menu item.');
      return;
    }

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
        email: formData.get('email'),
        deliveryAddress: formData.get('deliveryAddress'),
        pinCode: formData.get('pinCode'),
        orderDescription,
        selectedItems,
        amount: subtotal,
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
        const payload = await response.json().catch(() => ({}));
        const message = typeof payload?.error === 'string' ? payload.error : 'Failed to place order';
        throw new Error(message);
      }

      clearDeliveryCart();
      setQuantities({});
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
      setError(message);
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
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title">Place a Direct Order</h2>
          <p className="section-subtitle">Order directly with us for the best prices — no platform fees</p>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div className="bg-[#fdf6ec] rounded-xl p-8 shadow-xl">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🎉</div>
                  <h4 className="font-serif text-xl mb-2">Order Request Received!</h4>
                  <p className="text-[#555] text-sm">Your order is pending approval from admin. We&apos;ll confirm it by call or email once approved.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group"><label>Full Name *</label><input type="text" name="fullName" placeholder="Your name" required /></div>
                  <div className="form-group"><label>Phone *</label><input type="tel" name="phone" placeholder="+91 9491437799" required /></div>
                </div>
                <div className="form-group"><label>Email (optional)</label><input type="email" name="email" placeholder="you@example.com" /></div>
                <div className="form-group"><label>Delivery Address *</label><textarea name="deliveryAddress" placeholder="Full address including flat no., street, area…" required style={{ minHeight: '80px' }} /></div>
                <div className="form-group"><label>PIN Code *</label><input type="text" name="pinCode" placeholder="500034" maxLength={6} pattern="[0-9]{6}" required /></div>

                <div className="form-group">
                  <label>Select Menu Items *</label>
                  <div className="rounded-xl border border-[#e6d8c8] p-4 bg-white">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search menu item..."
                      className="w-full mb-3"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs font-bold text-[#555] mb-2">Diet Filter</p>
                        <div className="flex gap-2 flex-wrap">
                          {(['all', 'veg', 'nonveg'] as DietFilter[]).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setDietFilter(key)}
                              className="px-3 py-1 rounded-full text-xs font-bold border"
                              style={{
                                color: dietFilter === key ? '#fff' : '#b5451b',
                                background: dietFilter === key ? '#b5451b' : '#fff',
                                borderColor: '#b5451b',
                              }}
                            >
                              {key === 'all' ? 'All' : key === 'veg' ? 'Veg' : 'Non-Veg'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveCategory(key)}
                          className="px-3 py-1 rounded-full text-xs font-bold border"
                          style={{
                            color: activeCategory === key ? '#fff' : '#b5451b',
                            background: activeCategory === key ? '#b5451b' : '#fff',
                            borderColor: '#b5451b',
                          }}
                        >
                          {CATEGORY_LABELS[key]}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {filteredMenu.map((item) => {
                        const qty = quantities[item.name] || 0;
                        const isSelected = qty > 0;

                        return (
                        <div
                          key={item.name}
                          className={`flex items-center gap-3 rounded-lg border p-2 transition-colors ${
                            isSelected
                              ? 'border-[#b5451b] bg-[#fff2ea]'
                              : 'border-[#f0e5d8] bg-white'
                          }`}
                        >
                          <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-[#f4e7d8] flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold truncate">{item.name}</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.diet === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.diet === 'veg' ? 'Veg' : 'Non-Veg'}
                              </span>
                            </div>
                            <p className="text-xs text-[#777]">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button type="button" onClick={() => changeQty(item.name, -1)} className="w-8 h-8 rounded-full border border-[#b5451b] text-[#b5451b] font-bold">-</button>
                            <span className={`w-6 text-center text-sm font-bold ${isSelected ? 'text-[#b5451b]' : ''}`}>{qty}</span>
                            <button type="button" onClick={() => changeQty(item.name, 1)} className="w-8 h-8 rounded-full border border-[#b5451b] bg-[#b5451b] text-white font-bold">+</button>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Selected Items</label>
                  <div className="rounded-xl border border-[#e6d8c8] p-3 bg-white text-sm">
                    {selectedItems.length === 0 ? (
                      <p className="text-[#777]">No items selected yet.</p>
                    ) : (
                      <>
                        <div className="mb-2 flex justify-end">
                          <button
                            type="button"
                            onClick={clearSelectedItems}
                            className="rounded-full border border-[#b5451b] px-3 py-1 text-xs font-bold text-[#b5451b] hover:bg-[#fff2ea]"
                          >
                            Delete All Selected Items
                          </button>
                        </div>
                        <ul className="space-y-1 mb-2">
                          {selectedItems.map((item) => (
                            <li key={item.name} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>₹{item.lineTotal}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t pt-2 font-bold flex justify-between">
                          <span>Total</span>
                          <span>₹{subtotal}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Payment Method *</label>
                    <select name="paymentMethod" required defaultValue="">
                      <option value="" disabled>Select</option>
                      {['cash', 'upi', 'credit_card'].map((o) => <option key={o} value={o}>{o === 'cash' ? 'Cash on Delivery' : o === 'upi' ? 'UPI (GPay / PhonePe)' : 'Card on Delivery'}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Delivery Time</label><input type="time" name="preferredTime" /></div>
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

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-xl border border-[#e6d8c8] bg-white p-5 shadow-lg">
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b5451b] font-bold">Mini Cart</p>
                  <h3 className="font-serif text-2xl">Recently Selected</h3>
                </div>

                {selectedItems.length === 0 ? (
                  <p className="text-sm text-[#777]">Select items from the menu and they will appear here.</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                      {selectedItems.map((item) => (
                        <div key={item.name} className="flex items-center gap-3 rounded-lg bg-[#fdf6ec] p-2">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md bg-[#f4e7d8] flex-shrink-0">
                            <Image src={MENU_CATALOG.find((menuItem) => menuItem.name === item.name)?.image || '/images/menu/veg-biryani.jpg'} alt={item.name} fill className="object-cover" sizes="48px" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <p className="text-xs text-[#777]">Qty {item.quantity} • ₹{item.lineTotal}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {recentSelections.length > 0 && (
                      <div className="mb-4 rounded-lg border border-[#f0e5d8] p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b5451b] mb-2">Recent picks</p>
                        <div className="flex flex-wrap gap-2">
                          {recentSelections.map((name) => (
                            <span key={name} className="rounded-full bg-[#fff2ea] px-3 py-1 text-xs font-bold text-[#8a4a2b]">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t pt-4 font-bold">
                      <span>Total</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedItems}
                      className="mt-3 w-full rounded-full border border-[#b5451b] px-4 py-2 text-sm font-bold text-[#b5451b] hover:bg-[#fff2ea]"
                    >
                      Delete All Selected Items
                    </button>
                  </>
                )}

                <p className="mt-4 text-xs text-[#777]">This summary stays visible while you scroll the page.</p>
              </div>
            </aside>
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
