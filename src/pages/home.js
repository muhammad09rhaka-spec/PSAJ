import { getUser, logoutUser } from '../utils/store.js';
import { renderLogin } from './login.js';
import { renderUjianMenu } from './ujian.js';
import { renderRiwayat } from './riwayat.js';
import { renderKesan } from './kesan.js';

export const renderHome = () => {
  const container = document.getElementById('page-container');
  const user = getUser();
  
  if (!user) {
    renderLogin();
    return;
  }

  container.innerHTML = `
    <div class="page" style="display: flex; flex-direction: column; width: 100%; gap: 2rem;">
      <!-- Header -->
      <header class="glass-panel flex justify-between items-center">
        <div>
          <h1 style="font-size: 1.5rem; color: var(--primary);">Halo, ${user.nama} 👋</h1>
          <p class="text-muted">${user.nis} | Kelas: ${user.kelas}</p>
        </div>
        <button id="btn-logout" class="btn btn-secondary">Keluar</button>
      </header>
      
      <!-- Main Content -->
      <div class="grid grid-cols-3">
        
        <!-- Menu Ujian -->
        <div class="glass-panel" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; cursor: pointer; transition: transform 0.3s;" id="menu-ujian">
          <div style="font-size: 4rem; margin-bottom: 1rem;">📝</div>
          <h2 style="margin-bottom: 0.5rem;">Mulai Ujian</h2>
          <p class="text-muted" style="font-size: 0.875rem;">Akses 11 mata pelajaran PSAJ.</p>
        </div>
        
        <!-- Menu Riwayat -->
        <div class="glass-panel" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; cursor: pointer; transition: transform 0.3s;" id="menu-riwayat">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
          <h2 style="margin-bottom: 0.5rem;">Riwayat Ujian</h2>
          <p class="text-muted" style="font-size: 0.875rem;">Lihat skor dan analisis jawaban.</p>
        </div>

        <!-- Menu Kesan -->
        <div class="glass-panel" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; cursor: pointer; transition: transform 0.3s;" id="menu-kesan">
          <div style="font-size: 4rem; margin-bottom: 1rem;">💌</div>
          <h2 style="margin-bottom: 0.5rem;">Kesan & Pesan</h2>
          <p class="text-muted" style="font-size: 0.875rem;">Berikan masukan pengalaman ujian.</p>
        </div>

      </div>
    </div>
  `;

  // Provide hover effects dynamically or via CSS. 
  // Standard CSS logic applies, but inline scale adds instant pop.
  const menus = ['ujian', 'riwayat', 'kesan'];
  menus.forEach(menu => {
    const el = document.getElementById(`menu-${menu}`);
    el.addEventListener('mouseover', () => el.style.transform = 'translateY(-10px) scale(1.02)');
    el.addEventListener('mouseout', () => el.style.transform = 'none');
  });

  // Events
  document.getElementById('btn-logout').addEventListener('click', () => {
    logoutUser();
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderLogin(), 400);
  });

  document.getElementById('menu-ujian').addEventListener('click', () => {
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderUjianMenu(), 400);
  });

  document.getElementById('menu-riwayat').addEventListener('click', () => {
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderRiwayat(), 400);
  });

  document.getElementById('menu-kesan').addEventListener('click', () => {
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderKesan(), 400);
  });
};
