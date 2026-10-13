import { cafes } from '../data/cafes';
import { add, clear, getState, load, remove, setQuantity, subscribe } from './cart-store';
import { filterCafes } from './catalog-filters';
import { cartTotal, formatCop, lineSubtotal } from './format';
import type { CartState, CatalogFilters, OrderItem, ProcessMethod, Region, RoastProfile } from './types';

/**
 * Shared client island (DD-02).
 *
 * Vanilla TypeScript — no UI framework. Hydrates on every route and wires the
 * cart counter, drawer, add-to-cart buttons, filters and contact form. Every
 * query is guarded so a route missing a given element stays functional
 * (progressive enhancement). Mount contract: `[data-island="cart"]`.
 */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const cafeById = new Map(cafes.map((cafe) => [cafe.id, cafe] as const));

function q<T extends Element>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(selector);
}

function qa<T extends Element>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function cartQuantity(state: CartState): number {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

function announce(message: string): void {
  const status = q<HTMLElement>('[data-cart-status]');
  if (status) status.textContent = message;
}

/* ------------------------------------------------------------------ */
/* Cart rendering                                                      */
/* ------------------------------------------------------------------ */

function createCartItem(item: OrderItem): HTMLLIElement {
  const cafe = cafeById.get(item.cafeId);
  const name = cafe?.name ?? item.cafeId;

  const li = document.createElement('li');
  li.className = 'flex flex-col gap-2 border-b border-coffee-100 py-3';
  li.setAttribute('data-cart-item', item.cafeId);

  const header = document.createElement('div');
  header.className = 'flex items-start justify-between gap-2';

  const info = document.createElement('div');
  const nameEl = document.createElement('p');
  nameEl.className = 'font-medium text-coffee-900';
  nameEl.textContent = name;
  const unit = document.createElement('p');
  unit.className = 'text-xs text-coffee-500';
  unit.textContent = `${formatCop(item.priceCop)} c/u (demo)`;
  info.append(nameEl, unit);

  const subtotal = document.createElement('p');
  subtotal.className = 'text-sm font-semibold text-coffee-900';
  subtotal.textContent = formatCop(lineSubtotal(item));

  header.append(info, subtotal);

  const controls = document.createElement('div');
  controls.className = 'flex items-center justify-between gap-2';

  const qtyGroup = document.createElement('div');
  qtyGroup.className = 'flex items-center gap-2';
  qtyGroup.setAttribute('role', 'group');
  qtyGroup.setAttribute('aria-label', `Cantidad de ${name}`);

  const decrease = document.createElement('button');
  decrease.type = 'button';
  decrease.dataset.qtyDecrease = '';
  decrease.dataset.cafeId = item.cafeId;
  decrease.textContent = '−';
  decrease.setAttribute('aria-label', `Disminuir cantidad de ${name}`);
  decrease.disabled = item.quantity <= 1;
  decrease.className =
    'h-8 w-8 rounded border border-coffee-700 text-coffee-700 hover:bg-coffee-100 disabled:cursor-not-allowed disabled:opacity-40';

  const quantity = document.createElement('span');
  quantity.className = 'w-6 text-center text-sm';
  quantity.textContent = String(item.quantity);

  const increase = document.createElement('button');
  increase.type = 'button';
  increase.dataset.qtyIncrease = '';
  increase.dataset.cafeId = item.cafeId;
  increase.textContent = '+';
  increase.setAttribute('aria-label', `Aumentar cantidad de ${name}`);
  increase.className =
    'h-8 w-8 rounded border border-coffee-700 text-coffee-700 hover:bg-coffee-100';

  qtyGroup.append(decrease, quantity, increase);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.dataset.cartRemove = '';
  removeButton.dataset.cafeId = item.cafeId;
  removeButton.textContent = 'Eliminar';
  removeButton.setAttribute('aria-label', `Eliminar ${name} del pedido`);
  removeButton.className = 'text-sm text-accent hover:underline';

  controls.append(qtyGroup, removeButton);

  li.append(header, controls);
  return li;
}

function renderCart(state: CartState): void {
  const quantity = cartQuantity(state);

  qa<HTMLElement>('[data-cart-count]').forEach((badge) => {
    badge.textContent = String(quantity);
  });

  qa<HTMLElement>('[data-cart-open]').forEach((trigger) => {
    trigger.setAttribute(
      'aria-label',
      quantity > 0
        ? `Abrir carrito de compras, ${quantity} ${quantity === 1 ? 'producto' : 'productos'}`
        : 'Abrir carrito de compras',
    );
  });

  qa<HTMLElement>('[data-cart-total]').forEach((total) => {
    total.textContent = formatCop(cartTotal(state));
  });

  qa<HTMLButtonElement>('[data-cart-checkout]').forEach((button) => {
    button.disabled = state.items.length === 0;
  });

  const list = q<HTMLElement>('[data-cart-items]');
  if (list) {
    list.textContent = '';
    for (const item of state.items) {
      list.append(createCartItem(item));
    }
    list.hidden = state.items.length === 0;
  }

  const empty = q<HTMLElement>('[data-cart-empty]');
  if (empty) empty.hidden = state.items.length > 0;
}

/* ------------------------------------------------------------------ */
/* Cart drawer controller                                              */
/* ------------------------------------------------------------------ */

interface DrawerController {
  open: () => void;
}

function refocus(kind: 'qty-increase' | 'qty-decrease' | 'cart-remove', cafeId: string): void {
  const selector = `[data-${kind}][data-cafe-id="${cafeId}"]`;
  const requested = q<HTMLButtonElement>(selector);
  if (requested && !requested.disabled) {
    requested.focus();
    return;
  }
  const alt = q<HTMLButtonElement>(`[data-qty-increase][data-cafe-id="${cafeId}"]`);
  if (alt && !alt.disabled) {
    alt.focus();
    return;
  }
  q<HTMLElement>('[data-cart-close]')?.focus();
}

function createDrawerController(): DrawerController {
  const drawer = q<HTMLElement>('[data-cart-drawer]');
  const content = q<HTMLElement>('[data-cart-content]');
  const confirmation = q<HTMLElement>('[data-cart-confirmation]');
  const confirmationMessage = q<HTMLElement>('[data-cart-confirmation-message]');
  let lastFocused: HTMLElement | null = null;

  function focusableInDrawer(): HTMLElement[] {
    if (!drawer) return [];
    return qa<HTMLElement>(FOCUSABLE_SELECTOR, drawer).filter(
      (element) => !element.hasAttribute('hidden') && element.offsetParent !== null,
    );
  }

  function showContent(): void {
    if (confirmation) confirmation.hidden = true;
    if (content) content.hidden = false;
  }

  function showConfirmation(): void {
    if (content) content.hidden = true;
    if (confirmation) confirmation.hidden = false;
  }

  function open(): void {
    if (!drawer) return;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    showContent();
    drawer.hidden = false;
    drawer.setAttribute('data-open', 'true');
    document.documentElement.classList.add('overflow-hidden');
    focusableInDrawer()[0]?.focus();
  }

  function close(): void {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    drawer.removeAttribute('data-open');
    document.documentElement.classList.remove('overflow-hidden');
    (lastFocused ?? q<HTMLElement>('[data-cart-open]'))?.focus();
  }

  function handleCheckout(): void {
    const state = getState();
    if (state.items.length === 0) return;
    const quantity = cartQuantity(state);
    const total = cartTotal(state);
    if (confirmationMessage) {
      confirmationMessage.textContent =
        `Se registró un pedido simulado de ${quantity} ${quantity === 1 ? 'producto' : 'productos'} ` +
        `por un total de ${formatCop(total)}. No se realizó ninguna compra real.`;
    }
    showConfirmation();
    announce('Pedido simulado confirmado.');
    q<HTMLElement>('[data-cart-confirmation-close]')?.focus();
  }

  function handleConfirmationClose(): void {
    clear();
    showContent();
    announce('Pedido simulado cerrado. El carrito quedó vacío.');
    close();
  }

  function onClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const decrease = target.closest<HTMLButtonElement>('[data-qty-decrease]');
    if (decrease?.dataset.cafeId) {
      const { cafeId } = decrease.dataset;
      const item = getState().items.find((entry) => entry.cafeId === cafeId);
      if (item) setQuantity(cafeId, item.quantity - 1);
      refocus('qty-decrease', cafeId);
      return;
    }

    const increase = target.closest<HTMLButtonElement>('[data-qty-increase]');
    if (increase?.dataset.cafeId) {
      const { cafeId } = increase.dataset;
      const item = getState().items.find((entry) => entry.cafeId === cafeId);
      if (item) setQuantity(cafeId, item.quantity + 1);
      refocus('qty-increase', cafeId);
      return;
    }

    const removeButton = target.closest<HTMLButtonElement>('[data-cart-remove]');
    if (removeButton?.dataset.cafeId) {
      remove(removeButton.dataset.cafeId);
      announce('Producto eliminado del pedido.');
      refocus('cart-remove', removeButton.dataset.cafeId);
      return;
    }

    if (target.closest('[data-cart-checkout]')) {
      handleCheckout();
      return;
    }

    if (target.closest('[data-cart-confirmation-close]')) {
      handleConfirmationClose();
      return;
    }

    if (target.closest('[data-cart-close]') || target.closest('[data-cart-overlay]')) {
      close();
    }
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!drawer || drawer.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = focusableInDrawer();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  qa<HTMLElement>('[data-cart-open]').forEach((trigger) => trigger.addEventListener('click', open));
  drawer?.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);

  return { open };
}

/* ------------------------------------------------------------------ */
/* Add-to-cart buttons (catalog cards and detail page)                 */
/* ------------------------------------------------------------------ */

function wireAddToCart(openCart: () => void): void {
  qa<HTMLElement>('[data-add-to-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      const cafeId = button.dataset.cafeId;
      if (!cafeId || !cafeById.has(cafeId)) return;
      add(cafeId);
      openCart();
      // Announce after the drawer is visible so the live region is exposed.
      announce(`Se agregó ${cafeById.get(cafeId)?.name ?? 'el producto'} al pedido.`);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Catalog filters and search (home only)                              */
/* ------------------------------------------------------------------ */

function wireFilters(): void {
  const form = q<HTMLFormElement>('[data-filters]');
  if (!form) return;

  const searchInput = q<HTMLInputElement>('[data-search]', form);
  const regionSelect = q<HTMLSelectElement>('[data-filter="region"]', form);
  const roastSelect = q<HTMLSelectElement>('[data-filter="roast"]', form);
  const processSelect = q<HTMLSelectElement>('[data-filter="process"]', form);
  const resetButton = q<HTMLButtonElement>('[data-filters-reset]', form);
  const status = q<HTMLElement>('[data-filters-status]');
  const emptyMessage = q<HTMLElement>('[data-catalog-empty]');
  const cards = qa<HTMLElement>('[data-cafe-card]');

  function readFilters(): CatalogFilters {
    const filters: CatalogFilters = {};
    const query = searchInput?.value.trim();
    if (query) filters.query = query;
    if (regionSelect?.value) filters.region = regionSelect.value as Region;
    if (roastSelect?.value) filters.roast = roastSelect.value as RoastProfile;
    if (processSelect?.value) filters.process = processSelect.value as ProcessMethod;
    return filters;
  }

  function apply(): void {
    const visible = filterCafes(cafes, readFilters());
    const visibleIds = new Set(visible.map((cafe) => cafe.id));

    for (const card of cards) {
      const id = card.dataset.cafeId;
      card.hidden = id ? !visibleIds.has(id) : false;
    }

    if (emptyMessage) emptyMessage.hidden = visible.length > 0;
    if (status) {
      status.textContent = `${visible.length} ${visible.length === 1 ? 'café encontrado' : 'cafés encontrados'}.`;
    }
  }

  form.addEventListener('change', apply);
  form.addEventListener('input', apply);
  form.addEventListener('submit', (event) => event.preventDefault());
  resetButton?.addEventListener('click', () => {
    form.reset();
    apply();
  });

  apply();
}

/* ------------------------------------------------------------------ */
/* Contact form (home only)                                            */
/* ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldRule {
  name: string;
  emptyMessage: string;
}

const CONTACT_FIELDS: FieldRule[] = [
  { name: 'name', emptyMessage: 'Ingresa tu nombre.' },
  { name: 'email', emptyMessage: 'Ingresa tu correo electrónico.' },
  { name: 'message', emptyMessage: 'Escribe un mensaje.' },
];

function setFieldError(
  form: HTMLFormElement,
  name: string,
  input: HTMLInputElement | HTMLTextAreaElement,
  message: string,
): void {
  const errorElement = q<HTMLElement>(`[data-error-for="${name}"]`, form);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.hidden = message.length === 0;
  }
  if (message.length > 0) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
}

function wireContactForm(): void {
  const form = q<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const success = q<HTMLElement>('[data-contact-success]', form);

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return;
    const name = target.name;
    if (!name) return;
    const errorElement = q<HTMLElement>(`[data-error-for="${name}"]`, form);
    if (errorElement && !errorElement.hidden) {
      errorElement.textContent = '';
      errorElement.hidden = true;
      target.removeAttribute('aria-invalid');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid: HTMLElement | null = null;
    let isValid = true;

    for (const field of CONTACT_FIELDS) {
      const input = q<HTMLInputElement | HTMLTextAreaElement>(`[name="${field.name}"]`, form);
      if (!input) continue;

      const value = input.value.trim();
      let message = '';

      if (field.name === 'email') {
        if (value.length === 0) message = field.emptyMessage;
        else if (!EMAIL_PATTERN.test(value)) message = 'Ingresa un correo electrónico válido.';
      } else if (value.length === 0) {
        message = field.emptyMessage;
      }

      setFieldError(form, field.name, input, message);
      if (message.length > 0) {
        isValid = false;
        firstInvalid ??= input;
      }
    }

    if (!isValid) {
      if (success) {
        success.hidden = true;
        success.textContent = '';
      }
      firstInvalid?.focus();
      return;
    }

    if (success) {
      success.textContent =
        'Mensaje enviado (simulación de demostración). Este formulario no envía datos a ningún servidor.';
      success.hidden = false;
    }

    for (const field of CONTACT_FIELDS) {
      const input = q<HTMLInputElement | HTMLTextAreaElement>(`[name="${field.name}"]`, form);
      const errorElement = q<HTMLElement>(`[data-error-for="${field.name}"]`, form);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.hidden = true;
      }
      input?.removeAttribute('aria-invalid');
    }

    form.reset();
  });
}

/* ------------------------------------------------------------------ */
/* Bootstrap                                                           */
/* ------------------------------------------------------------------ */

function mountIsland(): void {
  const root = q<HTMLElement>('[data-island="cart"]');
  if (root) root.dataset.islandMounted = 'true';

  // Rehydrate the cart from localStorage before any view subscribes.
  load();

  const drawer = createDrawerController();
  wireAddToCart(drawer.open);
  wireFilters();
  wireContactForm();

  subscribe(renderCart);
  renderCart(getState());
}

mountIsland();
