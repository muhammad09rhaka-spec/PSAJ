import { SUBJECTS, getQuestionsBySubject } from '../data/subjects.js';
import { saveHistory, getCurrentExam, saveCurrentExam, clearCurrentExam } from '../utils/store.js';
import { renderHome } from './home.js';
import { renderRiwayat } from './riwayat.js';

export const renderUjianMenu = () => {
  const container = document.getElementById('page-container');
  
  // Periksa apakah sedang ada ujian berjalan (Kunci siswa tidak bisa kabur)
  const currentExam = getCurrentExam();
  if (currentExam) {
    alert('Anda sedang dalam sesi ujian yang belum selesai. Anda tidak bisa kembali dan harus melanjutkannya!');
    renderActiveExam(currentExam);
    return;
  }

  let subjectGrid = SUBJECTS.map(sub => `
    <div class="glass-panel text-center subject-card" data-id="${sub.id}" style="cursor: pointer; transition: 0.3s; padding: 1.5rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">${sub.icon}</div>
      <h3 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.5rem;">${sub.name}</h3>
      <p class="text-muted" style="font-size: 0.8rem;">50 pilihan ganda / 90 Menit</p>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="page" style="width: 100%;">
      <div class="flex justify-between items-center mb-4">
        <button id="btn-back" class="btn btn-secondary">⬅ Dashboard</button>
        <h2 style="color: var(--primary);">Pilih Mata Pelajaran</h2>
      </div>
      
      <div class="grid grid-cols-2" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
        ${subjectGrid}
      </div>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    container.firstElementChild.classList.add('fade-out');
    setTimeout(() => renderHome(), 400);
  });

  const cards = document.querySelectorAll('.subject-card');
  cards.forEach(card => {
    card.addEventListener('mouseover', () => card.style.transform = 'translateY(-5px) scale(1.02)');
    card.addEventListener('mouseout', () => card.style.transform = 'none');
    card.addEventListener('click', (e) => {
      const subjectId = e.currentTarget.getAttribute('data-id');
      startExam(subjectId);
    });
  });
};

const startExam = (subjectId) => {
  const container = document.getElementById('page-container');
  
  // Tampilkan animasi penyemangat
  container.innerHTML = `
    <div class="page flex justify-center items-center" style="height: 60vh; width: 100%; flex-direction: column; text-align: center;">
      <h1 style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem; animation: pulse 1.5s infinite;">✨ Semangat untuk ZUUBZUUB DINA LAURENCE SAYANG ✨</h1>
      <p class="text-muted" style="font-size: 1.2rem;">Menyiapkan ujian...</p>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; text-shadow: 0 0 20px var(--accent); }
        100% { transform: scale(1); opacity: 0.8; }
      }
    </style>
  `;

  setTimeout(() => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    const questions = getQuestionsBySubject(subjectId);
    
    const newExam = {
      subjectId: subject.id,
      subjectName: subject.name,
      questions: questions,
      answers: {},
      penalty: 0,
      timeRemaining: 90 * 60, // 90 minutes in seconds
      currentIndex: 0
    };
    
    saveCurrentExam(newExam);
    renderActiveExam(newExam);
  }, 3000); // Tampilkan animasi selama 3 detik
};

let timerInterval;

// Helper deteksi cheat dilekatkan secara global untuk keamanan
const handleVisibilityChange = () => {
  if (document.hidden) {
    const currentExam = getCurrentExam();
    if (currentExam) {
      currentExam.penalty += 20;
      saveCurrentExam(currentExam);
      alert('Peringatan: Anda telah terdeteksi keluar dari laman ujian! Nilai Anda dikurangi 20 poin.');
    }
  }
};

const renderActiveExam = (examState) => {
  // Pasangkan listener kecurangan jika belum dipasang
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const container = document.getElementById('page-container');
  const question = examState.questions[examState.currentIndex];
  const isLast = examState.currentIndex === examState.questions.length - 1;
  const isFirst = examState.currentIndex === 0;

  // Format Time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const optionsHtml = question.options.map(opt => {
    const isSelected = examState.answers[question.id] === opt.key;
    return `
      <div class="option-row ${isSelected ? 'selected' : ''}" data-key="${opt.key}" style="
        background: ${isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)'};
        border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'};
        padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 0.8rem;
        cursor: pointer; transition: 0.2s; display: flex; gap: 1rem; align-items: center;
      ">
        <span style="font-weight: bold; width: 24px; text-align: center;">${opt.key}</span>
        <span>${opt.text}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="page" style="width: 100%; max-width: 800px; margin: 0 auto;">
      <div class="flex justify-center mb-2">
        <span style="color: var(--error); font-size: 0.8rem;">Dilarang keluar dari tab/halaman. Pelanggaran: -20 Poin per aktivitas.</span>
      </div>
      <div class="glass-panel mb-4 flex justify-between items-center" style="padding: 1rem 2rem;">
        <div>
          <h3 style="color: var(--primary); margin:0;">${examState.subjectName}</h3>
          <p class="text-muted" style="font-size: 0.85rem; margin:0;">Soal ${examState.currentIndex + 1} dari ${examState.questions.length}</p>
        </div>
        <div style="font-size: 1.5rem; font-weight: bold; color: ${examState.timeRemaining < 300 ? 'var(--error)' : 'var(--text-main)'};" id="timer-display">
          ⏱ ${formatTime(examState.timeRemaining)}
        </div>
      </div>
      
      <div class="glass-panel mb-4">
        <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
          ${question.question}
        </p>
        
        <div class="options-container">
          ${question.type === 'multiple-choice' ? optionsHtml : `
            <textarea id="essay-answer" class="glass-panel" style="width: 100%; min-height: 150px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--glass-border); color: var(--text-main); padding: 1rem; border-radius: var(--radius-sm); font-family: inherit; font-size: 1rem; resize: vertical;" placeholder="Ketik jawaban Anda di sini...">${examState.answers[question.id] || ''}</textarea>
          `}
        </div>
      </div>
      
      <div class="flex justify-between">
        <button id="btn-prev" class="btn btn-secondary" ${isFirst ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>⬅ Sebelumnya</button>
        <button id="btn-next" class="btn ${isLast ? 'btn-accent' : 'btn-primary'}">${isLast ? 'Selesai Ujian & Simpan' : 'Selanjutnya ➡'}</button>
      </div>
    </div>
  `;

  // Start Timer Logic
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    examState.timeRemaining--;
    saveCurrentExam(examState);
    const display = document.getElementById('timer-display');
    if (display) {
      display.innerHTML = `⏱ ${formatTime(examState.timeRemaining)}`;
      if (examState.timeRemaining < 300) display.style.color = 'var(--error)';
    }

    if (examState.timeRemaining <= 0) {
      clearInterval(timerInterval);
      finishExam(examState);
    }
  }, 1000);

  // Selection Logic (Multiple Choice)
  if (question.type === 'multiple-choice') {
    document.querySelectorAll('.option-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        examState.answers[question.id] = key;
        saveCurrentExam(examState);
        // Update UI Select
        document.querySelectorAll('.option-row').forEach(r => {
          r.classList.remove('selected');
          r.style.background = 'rgba(15, 23, 42, 0.6)';
          r.style.border = '1px solid var(--glass-border)';
        });
        e.currentTarget.classList.add('selected');
        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
        e.currentTarget.style.border = '1px solid var(--primary)';
      });
    });
  } else {
    // Essay Logic
    const textarea = document.getElementById('essay-answer');
    textarea.addEventListener('input', (e) => {
      examState.answers[question.id] = e.target.value;
      saveCurrentExam(examState);
    });
  }

  // Nav Logic
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (!isFirst) {
      // Refresh state if changed by cheat listener
      const latestState = getCurrentExam();
      latestState.currentIndex--;
      saveCurrentExam(latestState);
      renderActiveExam(latestState);
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    const latestState = getCurrentExam();
    if (!isLast) {
      latestState.currentIndex++;
      saveCurrentExam(latestState);
      renderActiveExam(latestState);
    } else {
      if(confirm('Apakah Anda yakin ingin mengakhiri ujian dan mengirimkan jawaban? Peringatan: Tidak bisa diulang kembali.')) {
        finishExam(latestState);
      }
    }
  });

  // Blokir tombol Back pada Browser jika memungkinkan
  window.history.pushState(null, '', window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, '', window.location.href);
    alert('Dilarang kembali ke halaman sebelumnya selama ujian!');
  };
};

const finishExam = (examState) => {
  clearInterval(timerInterval);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.onpopstate = null; // restore pop state
  
  // Calculate score & differences
  let totalCorrect = 0;
  const analysis = examState.questions.map(q => {
    const userAnswer = (examState.answers[q.id] || '-').trim();
    let isCorrect = false;

    if (q.type === 'multiple-choice') {
      isCorrect = userAnswer === q.correctAnswer;
    } else {
      // Simple fuzzy match for short answers
      const correctAnswers = q.correctAnswer.toLowerCase()
        .split('/')
        .map(a => a.trim().replace(/[()]/g, ''));
      
      isCorrect = correctAnswers.some(ans => {
        // If the correct answer is contained in user answer or vice versa
        const cleanUser = userAnswer.toLowerCase();
        return cleanUser.includes(ans) || ans.includes(cleanUser);
      });
    }

    if (isCorrect) totalCorrect++;
    
    return {
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    };
  });
  
  // Kalkulasi Skor dengan Pemotongan (Penalty)
  let baseScore = Math.round((totalCorrect / examState.questions.length) * 100);
  let finalScore = baseScore - (examState.penalty || 0);
  if (finalScore < 0) finalScore = 0;
  
  const result = {
    subjectId: examState.subjectId,
    subjectName: examState.subjectName,
    score: finalScore,
    analysis
  };
  
  saveHistory(result);
  clearCurrentExam();
  
  // Go to history to see results
  const container = document.getElementById('page-container');
  container.firstElementChild.classList.add('fade-out');
  setTimeout(() => renderRiwayat(), 400);
};
