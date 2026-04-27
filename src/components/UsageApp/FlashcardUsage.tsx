export default function FlashcardUsage() {
  return (
    <div className="relative bg-white border-4 border-zinc-900 p-8 lg:p-12 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b-4 border-zinc-900 pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase text-zinc-900">
          Hướng dẫn học Flashcard
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] w-full border-4 border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-[8px_8px_0px_#18181b]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="w-full h-full object-cover"
            src="/images/flashcard.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-6 font-body font-semibold text-zinc-800 text-lg md:text-xl">
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 1:
              </span>{' '}
              Vào mục "Flashcard" và chọn bộ thẻ của chính mình, của cộng đồng
              hoặc của hệ thống
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 2:
              </span>{' '}
              Quan sát câu hỏi ở mặt trước, tự đưa ra câu trả lời rồi mới lật
              thẻ ra mặt sau để xem đáp án .
            </p>
          </div>
          <div className="border-4 border-dashed border-zinc-900 p-6 bg-zinc-50">
            <p className="font-body font-bold text-zinc-900 text-lg">
              💡 Mẹo: Nếu cảm thấy chưa thuộc hoặc chưa hiểu thẻ nào, hãy bấm
              nút "Chưa hiểu" để hệ thống ưu tiên cho bạn ôn tập lại những thẻ
              này vào cuối buổi học.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
