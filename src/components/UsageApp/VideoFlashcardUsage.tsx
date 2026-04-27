export default function VideoFlashcardUsage() {
  return (
    <div className="relative bg-white border-4 border-zinc-900 p-8 lg:p-12 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b-4 border-zinc-900 pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase text-zinc-900">
          Hướng dẫn Tạo Video và Flashcard bằng AI
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="aspect-[4/3] w-full border-4 border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-[8px_8px_0px_#18181b]">
            <img
              alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
              className="w-full h-full object-contain"
              src="/images/create-video.png"
            />
          </div>
          <div className="aspect-[4/3] w-full border-4 border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-[8px_8px_0px_#18181b]">
            <img
              alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
              className="w-full h-full object-cover"
              src="/images/library-usage.png"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-6 font-body font-semibold text-zinc-800 text-lg md:text-xl">
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Tạo Flashcard:
              </span>{' '}
              Nhập yêu cầu kèm từ khóa vào khung chat, ví dụ: "Hãy tạo cho tôi
              10 flashcard về công thức tính diện tích tam giác". Hệ thống sẽ xử
              lý và trả về bộ thẻ ghi nhớ sau chưa đầy 30 giây.
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Tạo Video:
              </span>{' '}
              Nhập yêu cầu có từ khóa "tạo video" kèm chủ đề. Hệ thống sẽ tự
              động soạn kịch bản, tạo hình ảnh minh họa và chuyển văn bản thành
              giọng nói để ghép thành video hoàn chỉnh sau khoảng 2-3 phút .
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Chia sẻ:
              </span>{' '}
              Sau khi tạo xong, bạn có thể chia sẻ các tài liệu này cho cộng
              đồng cùng sử dụng.
            </p>
          </div>
          <div className="border-4 border-dashed border-zinc-900 p-6 bg-zinc-50">
            <p className="font-body font-bold text-zinc-900 text-lg">
              💡 Mẹo:Hãy thêm các từ khóa như "tạo video", "tạo flashcard" để AI
              nhận diện tốt yêu cầu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
