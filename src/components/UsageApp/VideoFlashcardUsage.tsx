export default function VideoFlashcardUsage() {
  return (
    <div className="relative flex flex-col gap-8 border-4 border bg-background p-8 lg:p-12">
      <div className="flex items-center gap-4 border-b-4 border pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl font-black uppercase text-foreground md:text-3xl">
          Hướng dẫn Tạo Video và Flashcard bằng AI
        </h2>
      </div>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border bg-muted shadow-[8px_8px_0px_var(--foreground)]">
            <img
              alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
              className="h-full w-full object-contain"
              src="/images/create-video.png"
            />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border bg-muted shadow-[8px_8px_0px_var(--foreground)]">
            <img
              alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
              className="h-full w-full object-cover"
              src="/images/library-usage.png"
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="font-body space-y-6 text-lg font-semibold text-muted-foreground md:text-xl">
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Tạo Flashcard:
              </span>{' '}
              Nhập yêu cầu kèm từ khóa vào khung chat, ví dụ: &quot;Hãy tạo cho
              tôi 10 flashcard về công thức tính diện tích tam giác&quot;. Hệ
              thống sẽ xử lý và trả về bộ thẻ ghi nhớ sau chưa đầy 30 giây.
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Tạo Video:
              </span>{' '}
              Nhập yêu cầu có từ khóa &quot;tạo video&quot; kèm chủ đề. Hệ thống
              sẽ tự động soạn kịch bản, tạo hình ảnh minh họa và chuyển văn bản
              thành giọng nói để ghép thành video hoàn chỉnh sau khoảng 2-3 phút
              .
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Chia sẻ:
              </span>{' '}
              Sau khi tạo xong, bạn có thể chia sẻ các tài liệu này cho cộng
              đồng cùng sử dụng.
            </p>
          </div>
          <div className="border-4 border-dashed border bg-muted p-6">
            <p className="font-body text-lg font-bold text-foreground">
              💡 Mẹo:Hãy thêm các từ khóa như &quot;tạo video&quot;, &quot;tạo
              flashcard&quot; để AI nhận diện tốt yêu cầu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
