const registerServiceWorker = () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => {
        console.log('ServiceWorker registration successful with scope: ', reg.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  }
};
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  registerServiceWorker();
}
