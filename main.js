import { getUser } from './src/utils/store.js';
import { renderLogin } from './src/pages/login.js';
import { renderHome } from './src/pages/home.js';

// Entry point aplikasi
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  
  // Jika User sudah login, arahkan ke Home. Jika belum, tampilkan Login.
  if (user) {
    renderHome();
  } else {
    renderLogin();
  }
});