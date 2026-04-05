import { getHistory } from '../utils/store.js';
import { renderHome } from './home.js';

export const renderRiwayat = () => {
  const container = document.getElementById('page-container');
  const history = getHistory();

  let contentHtml = '';

  if (history.length === 0) {
    contentHtml = `
      <div class="glass-panel text-center" style="padding: 4rem;">
        <h3 style="color: var(--text-muted); margin-bottom: 1rem;">Belum Ada Riwayat Ujian</h3>
        <p>Silakan mulai ujian terlebih dahulu untuk melihat analisis hasil.</p>
      </div>
    `;
  } else {
    // Tampilkan history dalam format list accordion atau card
    contentHtml = history.map((h, i) => `
      <div class="glass-panel mb-3" style="padding: 1.5rem; transition: 0.3s; cursor: pointer;" onclick="document.getElementById('analysis-${i}').classList.toggle('hidden')">
        <div class="flex justify-between items-center">
          <div>
            <h3 style="color: var(--primary); font-size: 1.25rem;">${h.subjectName}</h3>
            <p class="text-muted" style="font-size: 0.875rem;">Diselesaikan pada: ${new Date(h.date).toLocaleString('id-ID')}</p>
          </div>
          <div style="font-size: 2rem; font-weight: bold; color: ${h.score >= 70 ? 'var(--success)' : 'var(--error)'}">
            ${h.score}
          </div>
        </div>
        
        <!-- Dropdown analysis -->
        <div id="analysis-${i}" class="hidden" style="margin-top: 1.5rem; border-top: 1px solid var(--glass-border); padding-top: 1rem;">
          <h4 style="margin-bottom: 1rem;">Analisis Jawaban</h4>
          ${h.analysis.map((a, j) => `
            <div style="margin-bottom: 1rem; padding: 1rem; border-radius: var(--radius-sm); background: rgba(15, 23, 42, 0.4); border-left: 4px solid ${a.isCorrect ? 'var(--success)' : 'var(--error)'};">
              <p style="margin-bottom: 0.5rem; font-size: 0.95rem;"><strong>${j + 1}.</strong> ${a.question}</p>
              <div class="flex gap-4 mb-2" style="font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Jawaban Anda: <b style="color: ${a.isCorrect ? 'var(--success)' : 'var(--error)'}">${a.userAnswer}</b></span>
                <span style="color: var(--text-muted);">Jawaban Benar: <b style="color: var(--success)">${a.correctAnswer}</b></span>
              </div>
              ${!a.isCorrect ? `<div style="font-size: 0.85rem; color: #fbbf24; background: rgba(251, 191, 36, 0.1); padding: 0.5rem; border-radius: var(--radius-sm);">💡 <strong>Pembahasan:</strong> ${a.explanation}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).reverse().join('');
  }

  container.innerHTML = `
    <style>
      .hidden { display: none !important; }
    </style>
    <div class="page" style="width: 100%;">
      <div class="flex justify-between items-center mb-4">
        <button id="btn-back" class="btn btn-secondary">⬅ Dashboard</button>
        <h2 style="color: var(--primary);">Riwayat Ujian</h2>
        <div style="width: 100px;"></div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${contentHtml}
      </div>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderHome(), 400);
  });
};
