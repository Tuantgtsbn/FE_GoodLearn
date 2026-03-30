const STORAGE_KEY = 'GOODLEARN_FLASHCARD_PROGRESS';

interface IFlashcardProgress {
  /** Map of flashcardSetId to an array of flashcardIds that are "not understood" */
  [setId: string]: string[];
}

/**
 * Lấy toàn bộ lịch sử tiến độ học thẻ chưa được đồng bộ backend
 */
const getProgressData = (): IFlashcardProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Lỗi lấy tiến độ flashcard:', error);
    return {};
  }
};

/**
 * Lưu toàn bộ lịch sử tiến độ học thẻ
 */
const saveProgressData = (data: IFlashcardProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Lỗi lưu tiến độ flashcard:', error);
  }
};

/**
 * Lấy các flashcardId chưa hiểu của 1 bộ thẻ (setId)
 */
export const getNotUnderstoodCards = (setId: string): string[] => {
  const data = getProgressData();
  return data[setId] || [];
};

/**
 * Đánh dấu 1 thẻ là "Chưa hiểu"
 */
export const markCardAsNotUnderstood = (setId: string, cardId: string) => {
  const data = getProgressData();
  const setProgress = data[setId] || [];

  if (!setProgress.includes(cardId)) {
    setProgress.push(cardId);
    data[setId] = setProgress;
    saveProgressData(data);
  }
};

/**
 * Đánh dấu 1 thẻ là "Đã hiểu" (Xoá khỏi danh sách chưa hiểu, nếu có)
 */
export const markCardAsUnderstood = (setId: string, cardId: string) => {
  const data = getProgressData();
  const setProgress = data[setId] || [];

  const index = setProgress.indexOf(cardId);
  if (index !== -1) {
    setProgress.splice(index, 1);
    data[setId] = setProgress;
    saveProgressData(data);
  }
};

/**
 * Reset tiến độ của 1 bộ thẻ (VD: khi người dùng muốn ôn lại từ đầu)
 */
export const resetSetProgress = (setId: string) => {
  const data = getProgressData();
  delete data[setId];
  saveProgressData(data);
};

export default {
  getNotUnderstoodCards,
  markCardAsNotUnderstood,
  markCardAsUnderstood,
  resetSetProgress,
};
