import { createElement } from '../utils/dom.js';

export function createModal() {
  const content = createElement('div', {
    className: 'modal__content',
    attrs: { role: 'document' },
  });

  const dialog = createElement('div', {
    className: 'modal__dialog',
    attrs: { role: 'dialog', 'aria-modal': 'true' },
    children: [content],
  });

  const overlay = createElement('div', {
    className: 'modal',
    attrs: { hidden: '' },
    children: [dialog],
  });

  let onCloseCallback = null;
  let isOpen = false;
  let previouslyFocused = null;

  const setBackgroundInert = (enabled) => {
    const parent = overlay.parentElement;
    if (!parent) {
      return;
    }

    Array.from(parent.children).forEach((child) => {
      if (child !== overlay) {
        if (enabled) {
          child.setAttribute('inert', '');
        } else {
          child.removeAttribute('inert');
        }
      }
    });
  };

  const close = () => {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    overlay.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    setBackgroundInert(false);

    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }

    previouslyFocused = null;

    if (typeof onCloseCallback === 'function') {
      onCloseCallback();
    }
  };

  const open = (body, options = {}) => {
    onCloseCallback = options.onClose ?? null;
    previouslyFocused = document.activeElement;

    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }

    const nodes = Array.isArray(body) ? body : [body];
    nodes.filter(Boolean).forEach((node) => content.append(node));

    overlay.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    setBackgroundInert(true);
    isOpen = true;

    const focusTarget =
      content.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ||
      content;
    if (typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
  };

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  dialog.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      close();
    }
  });

  return {
    element: overlay,
    open,
    close,
    isOpen: () => isOpen,
  };
}
