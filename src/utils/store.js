// LocalStorage Keys
const KEYS = {
  USER: 'psaj_user',
};

// User Identity
export const getUser = () => {
  const data = sessionStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (userData) => {
  sessionStorage.setItem(KEYS.USER, JSON.stringify(userData));
};

export const logoutUser = () => {
  sessionStorage.removeItem(KEYS.USER);
};

// Helper for namespaced key (pisahkan riwayat per siswa berdasarkan NIS)
const getNamespacedKey = (baseKey) => {
  const user = getUser();
  return user && user.nis ? `${baseKey}_${user.nis}` : baseKey;
};

// Exam History
export const getHistory = () => {
  const data = localStorage.getItem(getNamespacedKey('psaj_history'));
  return data ? JSON.parse(data) : [];
};

export const saveHistory = (examResult) => {
  const history = getHistory();
  history.push({
    ...examResult,
    date: new Date().toISOString()
  });
  localStorage.setItem(getNamespacedKey('psaj_history'), JSON.stringify(history));
};

export const getSubjectHistory = (subjectId) => {
  const history = getHistory();
  // Return the latest attempt for this subject
  return history.reverse().find(h => h.subjectId === subjectId);
};

// Active Exam Session (for recovery or timer)
export const getCurrentExam = () => {
  const data = localStorage.getItem(getNamespacedKey('psaj_current_exam'));
  return data ? JSON.parse(data) : null;
};

export const saveCurrentExam = (examData) => {
  localStorage.setItem(getNamespacedKey('psaj_current_exam'), JSON.stringify(examData));
};

export const clearCurrentExam = () => {
  localStorage.removeItem(getNamespacedKey('psaj_current_exam'));
};
