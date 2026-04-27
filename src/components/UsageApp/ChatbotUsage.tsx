export default function ChatbotUsage() {
  return (
    <div className="relative bg-white border-4 border-zinc-900 p-8 lg:p-12 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b-4 border-zinc-900 pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase text-zinc-900">
          Hướng dẫn sử dụng Chatbot AI
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] w-full border-4 border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-[8px_8px_0px_#18181b]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="w-full h-full object-cover scale-110"
            src="/images/chatbot-usage.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-6 font-body font-semibold text-zinc-800 text-lg md:text-xl">
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 1:
              </span>{' '}
              Nhập câu hỏi bất kỳ (Ví dụ: 'Công thức diện tích tam giác') vào ô
              chat.
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 2:
              </span>{' '}
              AI xử lý và phản hồi kiến thức chính xác ngay lập tức.
            </p>
          </div>
          <div className="border-4 border-dashed border-zinc-900 p-6 bg-zinc-50">
            <p className="font-body font-bold text-zinc-900 text-lg">
              💡 Mẹo: Chatbot của chúng mình cực kỳ trung thực, nếu không biết
              sẽ nói không biết chứ không 'bịa' đâu nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
