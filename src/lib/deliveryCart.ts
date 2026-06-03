export const DELIVERY_CART_KEY = 'ssr_delivery_cart';

export type DeliveryCart = Record<string, number>;

export function readDeliveryCart(): DeliveryCart {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(DELIVERY_CART_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, number>;
    const cleaned: DeliveryCart = {};

    Object.entries(parsed).forEach(([name, qty]) => {
      const value = Number(qty);
      if (Number.isFinite(value) && value > 0) {
        cleaned[name] = Math.floor(value);
      }
    });

    return cleaned;
  } catch {
    return {};
  }
}

export function writeDeliveryCart(cart: DeliveryCart): void {
  if (typeof window === 'undefined') return;

  const cleaned: DeliveryCart = {};
  Object.entries(cart).forEach(([name, qty]) => {
    const value = Number(qty);
    if (Number.isFinite(value) && value > 0) {
      cleaned[name] = Math.floor(value);
    }
  });

  window.localStorage.setItem(DELIVERY_CART_KEY, JSON.stringify(cleaned));
}

export function clearDeliveryCart(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DELIVERY_CART_KEY);
}
