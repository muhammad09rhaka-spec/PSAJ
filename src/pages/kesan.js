import { renderHome } from './home.js';

export const renderKesan = () => {
  const container = document.getElementById('page-container');

  container.innerHTML = `
    <div class="page glass-panel" style="max-width: 600px; margin: 0 auto; align-self: center;">
      <div class="flex justify-between items-center mb-4">
        <button id="btn-back" class="btn btn-secondary">⬅ Dashboard</button>
        <h2 style="color: var(--primary);">Kesan & Pesan</h2>
        <div style="width: 100px;"></div>
      </div>
      
      <p class="text-muted mb-4 text-center">
        Bagaimana pengalaman Anda saat menggunakan platform ujian ini serta mengikuti PSAJ?
      </p>
      
      <form id="kesan-form">
        <div class="input-group">
          <label class="input-label" for="kesanText">Kesan (Pengalaman & Perasaan)</label>
          <textarea id="kesanText" class="input-field" rows="4" placeholder="Tulis kesan Anda di sini..." required></textarea>
        </div>
        
        <div class="input-group mb-4">
          <label class="input-label" for="pesanText">Pesan (Kritik & Saran)</label>
          <textarea id="pesanText" class="input-field" rows="4" placeholder="Tuliskan pesan atau masukan Anda..." required></textarea>
        </div>
        
        <button type="submit" class="btn w-full flex items-center justify-center gap-2" style="width: 100%;">
          <span>Kirim Feedback</span> <span>🚀</span>
        </button>
      </form>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderHome(), 400);
  });

  document.getElementById('kesan-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real app, this would be sent to a backend DB.
    // For now, we simulate a successful submission.
    
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Mengirim...';
    btn.style.opacity = '0.7';
    
    setTimeout(() => {
      alert('Terima kasih! Kesan dan Pesan Anda telah terkirim.');
      container.firstElementChild.classList.add('fade-out');
      setTimeout(() => renderHome(), 400);
    }, 1000);
  });
};
