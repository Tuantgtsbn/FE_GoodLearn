import { useRef, useState, useCallback } from 'react';

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  getRecordingBlob: () => Blob | null;
  cleanup: () => void;
  error: string | null;
}

/**
 * Custom hook để ghi âm audio qua MediaRecorder API
 * Trả về Blob dạng webm/audio khi stopRecording
 */
export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];
      blobRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // thu từng chunk mỗi 1 giây
      setIsRecording(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Không thể truy cập microphone';
      setError(message);
      console.error('Recording error:', err);
      throw err; // Re-throw để caller có thể catch và xử lý
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        blobRef.current = blob;
        setIsRecording(false);

        // Dọn dẹp stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        resolve(blob);
      };

      recorder.stop();
    });
  }, []);

  const getRecordingBlob = useCallback((): Blob | null => {
    return blobRef.current;
  }, []);

  /**
   * Giải phóng stream micro ngay lập tức (không cần await).
   * Dùng khi unmount component để browser ngừng hiển thị icon micro.
   */
  const cleanup = useCallback(() => {
    // Dừng recorder nếu đang chạy
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    mediaRecorderRef.current = null;

    // Giải phóng tất cả track của stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    chunksRef.current = [];
    blobRef.current = null;
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    getRecordingBlob,
    cleanup,
    error,
  };
};
