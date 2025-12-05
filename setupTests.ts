import "@testing-library/jest-dom";

// Basic ResizeObserver stub to avoid errors from libs that expect it.
if (typeof (global as any).ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  (global as any).ResizeObserver = ResizeObserver;
}
