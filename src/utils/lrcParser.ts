/**
 * LRC (Lyric) file parser
 * Format: [mm:ss.xx] lyric text
 */

export interface LrcLine {
  time: number; // thời gian tính bằng giây
  text: string;
  endTime?: number; // thời gian kết thúc (từ END marker), nếu không có sẽ dùng dòng tiếp theo
  isEndMarker?: boolean; // Đánh dấu dòng END (không hiển thị, chỉ dùng để tính timing)
  isEndOfSong?: boolean; // Đánh dấu END cuối cùng (kết thúc bài hát)
}

/**
 * Parse timestamp LRC thành giây
 * Hỗ trợ: [mm:ss.xx], [mm:ss.xxx], [mm:ss]
 */
const parseTimestamp = (timestamp: string): number => {
  const match = timestamp.match(/(\d+):(\d+)(?:\.(\d+))?/);
  if (!match) return 0;

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const ms = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) : 0;

  return minutes * 60 + seconds + ms / 1000;
};

/**
 * Parse nội dung LRC thành mảng LrcLine đã sắp xếp theo thời gian
 * Hỗ trợ marker END: [mm:ss.xx]END - đánh dấu điểm kết thúc đoạn nghỉ
 */
export const parseLrc = (lrcContent: string): LrcLine[] => {
  const lines = lrcContent.split('\n');
  const result: LrcLine[] = [];
  const endMarkers: Array<{ time: number; isEndOfSong: boolean }> = [];

  for (const line of lines) {
    // Bỏ qua metadata tags như [ti:], [ar:], [al:], [by:]
    if (/^\[(?:ti|ar|al|by|offset|re|ve):/.test(line)) continue;

    // Match tất cả timestamps trong 1 dòng (hỗ trợ multi-timestamp)
    const timestampRegex = /\[(\d+:\d+(?:\.\d+)?)\]/g;
    const timestamps: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = timestampRegex.exec(line)) !== null) {
      timestamps.push(parseTimestamp(match[1]));
    }

    if (timestamps.length === 0) continue;

    // Lấy text sau tất cả timestamps
    const text = line.replace(/\[\d+:\d+(?:\.\d+)?\]/g, '').trim();

    // Phát hiện marker END (case-insensitive)
    if (text.toUpperCase() === 'END' || text.toUpperCase() === '[END]') {
      // Lưu thời gian END marker để xử lý sau
      for (const time of timestamps) {
        endMarkers.push({ time, isEndOfSong: false });
      }
      continue; // Không thêm END vào result
    }

    if (!text) continue;

    for (const time of timestamps) {
      result.push({ time, text });
    }
  }

  // Đánh dấu END cuối cùng là isEndOfSong
  if (endMarkers.length > 0) {
    endMarkers[endMarkers.length - 1].isEndOfSong = true;
  }

  // Gán endTime cho các dòng dựa vào END markers hoặc dòng tiếp theo
  // Mỗi END marker sẽ gắn với dòng gần nhất trước nó
  for (const marker of endMarkers) {
    // Tìm dòng có time < endTime gần nhất
    let closestLineIdx = -1;
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].time < marker.time) {
        closestLineIdx = i;
        break;
      }
    }
    // Gán endTime cho dòng đó (nếu tìm thấy)
    if (closestLineIdx >= 0) {
      result[closestLineIdx] = {
        ...result[closestLineIdx],
        endTime: marker.time,
        isEndOfSong: marker.isEndOfSong,
      };
    }
  }

  // Sắp xếp theo thời gian
  result.sort((a, b) => a.time - b.time);

  return result;
};

/**
 * Tìm index dòng lyric hiện tại dựa trên thời gian
 * Trả về index cuối cùng có time <= currentTime
 * Nếu dòng có endTime (từ END marker) và currentTime > endTime → trả về -1 (đang nghỉ)
 */
export const getCurrentLineIndex = (
  lines: LrcLine[],
  currentTime: number
): number => {
  let low = 0;
  let high = lines.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (lines[mid].time <= currentTime) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Nếu dòng tìm được có endTime (END marker) và currentTime đã qua endTime
  // → đang trong khoảng nghỉ giữa các đoạn, không highlight dòng nào
  if (result >= 0) {
    const endTime = lines[result].endTime;
    if (endTime != null && currentTime > endTime) {
      return -1;
    }
  }

  return result;
};

/**
 * Format thời gian giây thành mm:ss
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
