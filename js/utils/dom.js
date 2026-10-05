export function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  const { className, attrs = {}, text, children = [] } = options;

  if (className) {
    const classes = Array.isArray(className) ? className : className.split(' ');
    element.classList.add(...classes.filter(Boolean));
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });

  if (text !== undefined) {
    element.textContent = text;
  }

  children.filter(Boolean).forEach((child) => {
    if (typeof child === 'string') {
      element.append(document.createTextNode(child));
    } else {
      element.append(child);
    }
  });

  return element;
}
