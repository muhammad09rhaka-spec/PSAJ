import { saveUser } from '../utils/store.js';
import { renderHome } from './home.js';

export const renderLogin = () => {
  const container = document.getElementById('page-container');
  
  container.innerHTML = `
    <div class="page glass-panel" style="max-width: 500px; margin: 0 auto; align-self: center;">
      <div class="text-center mb-4">
        <h2 style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;">CBT PSAJ</h2>
        <p class="text-muted">Masanggrahi Penilaian Sumatif Akhir Jenjang</p>
      </div>
      
      <form id="login-form">
        <div class="input-group">
          <label class="input-label" for="studentName">Nama Lengkap</label>
          <input type="text" id="studentName" class="input-field" placeholder="Masukkan nama..." required autocomplete="off" />
        </div>
        
        <div class="input-group">
          <label class="input-label" for="studentNis">Nomor Induk Siswa (NIS)</label>
          <input type="text" id="studentNis" class="input-field" placeholder="Masukkan NIS..." required autocomplete="off" />
        </div>
        
        <div class="input-group mb-4">
          <label class="input-label" for="studentClass">Kelas</label>
          <select id="studentClass" class="input-field" required>
            <option value="" disabled selected>Pilih kelas...</option>
            <option value="RPL">RPL</option>
            <option value="TKJ 1">TKJ 1</option>
            <option value="TKJ 2">TKJ 2</option>
            <option value="DKV 1">DKV 1</option>
            <option value="DKV 2">DKV 2</option>
            <option value="MKT 1">MKT 1</option>
            <option value="MKT 2">MKT 2</option>
            <option value="TPM 1">TPM 1</option>
            <option value="TPM 2">TPM 2</option>
            <option value="TKR 1">TKR 1</option>
            <option value="TKR 2">TKR 2</option>
            <option value="TBKR">TBKR</option>
            <option value="TL 1">TL 1</option>
            <option value="TL 2">TL 2</option>
            <option value="ATPH 1">ATPH 1</option>
            <option value="ATPH 2">ATPH 2</option>
            <option value="ATPH 3">ATPH 3</option>
            <option value="APHP 1">APHP 1</option>
            <option value="APHP 2">APHP 2</option>
          </select>
        </div>
        
        <button type="submit" class="btn w-full" style="width: 100%;">Masuk Ujian</button>
      </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nama = document.getElementById('studentName').value;
    const nis = document.getElementById('studentNis').value;
    const kelas = document.getElementById('studentClass').value;
    
    // Save to local storage
    saveUser({ nama, nis, kelas });
    
    // Animate out and render home
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => {
      renderHome();
    }, 400);
  });
};
