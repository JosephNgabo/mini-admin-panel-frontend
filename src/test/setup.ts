import '@testing-library/jest-dom'

// Polyfill ResizeObserver for libraries like Recharts in jsdom
if (typeof (global as any).ResizeObserver === 'undefined') {
  ;(global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Optional: stub matchMedia used by some components/libs
if (!(window as any).matchMedia) {
  ;(window as any).matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// Polyfill createObjectURL for tests
if (!('createObjectURL' in URL)) {
  ;(URL as any).createObjectURL = () => 'blob:mock'
}
if (!('revokeObjectURL' in URL)) {
  ;(URL as any).revokeObjectURL = () => {}
}

// Avoid jsdom navigation errors when programmatically clicking download links
try {
  Object.defineProperty(HTMLAnchorElement.prototype as any, 'click', {
    value: () => {},
  })
} catch {}


