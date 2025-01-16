// Mock the current user globally
window.currentUser = 1

beforeEach(() => {
  // Add the CSRF token meta tag to the document head
  const meta = document.createElement("meta");
  meta.name = "csrf-token";
  meta.content = "test-csrf-token";
  document.head.appendChild(meta);
});

afterEach(() => {
  // Clean up the meta tag after each test
  const meta = document.querySelector("meta[name='csrf-token']");
  if (meta) {
    meta.remove();
  }
});