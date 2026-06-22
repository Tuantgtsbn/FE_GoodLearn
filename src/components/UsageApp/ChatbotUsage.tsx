export default function ChatbotUsage() {
  return (
    <div className="relative flex flex-col gap-8 border-4 border bg-background p-8 lg:p-12">
      <div className="flex items-center gap-4 border-b-4 border pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl font-black uppercase text-foreground md:text-3xl">
          Hướng dẫn sử dụng Chatbot AI
        </h2>
      </div>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border bg-muted shadow-[8px_8px_0px_var(--foreground)]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="h-full w-full scale-110 object-cover"
            src="/images/chatbot-usage.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="font-body space-y-6 text-lg font-semibold text-muted-foreground md:text-xl">
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 1:
              </span>{' '}
              Nhập câu hỏi bất kỳ (Ví dụ: &apos;Công thức diện tích tam
              giác&apos;) vào ô chat.
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 2:
              </span>{' '}
              AI xử lý và phản hồi kiến thức chính xác ngay lập tức.
            </p>
          </div>
          <div className="border-4 border-dashed border bg-muted p-6">
            <p className="font-body text-lg font-bold text-foreground">
              💡 Mẹo: Chatbot của chúng mình cực kỳ trung thực, nếu không biết
              sẽ nói không biết chứ không &apos;bịa&apos; đâu nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
