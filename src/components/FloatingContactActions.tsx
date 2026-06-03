'use client';

import { useEffect, useRef, useState } from 'react';

export default function FloatingContactActions() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const phone = '+919491437799';
  const email = 'ssrrestaurant007@gmail.com';
  const whatsappText = encodeURIComponent('Hi SSR Restaurant, I want to place an order / need support.');
  const mailSubject = encodeURIComponent('Order / Support Request - SSR Restaurant');
  const mailBody = encodeURIComponent('Hi SSR Team,%0D%0A%0D%0AI would like to place an order / need support.%0D%0A%0D%0AThanks.');

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      <div ref={menuRef} className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-2 md:bottom-6">
        {open && (
          <>
            <a
              href={`https://wa.me/${phone.replace('+', '')}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
              aria-label="Chat on WhatsApp"
              title="WhatsApp"
            >
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6 fill-current">
                <path d="M19.11 17.46c-.27-.14-1.59-.79-1.84-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.71-1.32-1.59-1.48-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.96 4.68 4.15.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.59-.65 1.82-1.27.23-.62.23-1.15.16-1.27-.07-.12-.25-.19-.52-.33zM16.02 3C9.38 3 4 8.38 4 15.02c0 2.24.62 4.43 1.8 6.34L4 29l7.82-1.73a11.96 11.96 0 0 0 4.2.75c6.64 0 12.02-5.38 12.02-12.02C28.04 8.38 22.66 3 16.02 3zm0 21.84c-1.31 0-2.6-.22-3.82-.65l-.27-.09-4.64 1.03 1.04-4.52-.18-.29a9.8 9.8 0 0 1-1.5-5.19c0-5.42 4.41-9.83 9.83-9.83 5.42 0 9.83 4.41 9.83 9.83 0 5.42-4.41 9.71-9.29 9.71z" />
              </svg>
            </a>

            <a
              href={`mailto:${email}?subject=${mailSubject}&body=${mailBody}`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1a1a] text-xl text-white shadow-lg transition-transform hover:scale-105"
              aria-label="Email SSR Restaurant"
              title="Email"
            >
              ✉
            </a>

            <a
              href={`tel:${phone}`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#b5451b] text-xl text-white shadow-lg transition-transform hover:scale-105"
              aria-label="Call SSR Restaurant"
              title="Call"
            >
              📞
            </a>
          </>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full bg-[#b5451b] px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Open contact options"
        >
          {open ? '✕' : 'Contact Us'}
        </button>
      </div>
    </>
  );
}
