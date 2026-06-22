export default function KaraokeUsage() {
  return (
    <div className="relative flex flex-col gap-8 border-4 border bg-background p-8 lg:p-12">
      <div className="flex items-center gap-4 border-b-4 border pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl font-black uppercase text-foreground md:text-3xl">
          Hướng dẫn sử dụng Karaoke Quan họ
        </h2>
      </div>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border bg-muted shadow-[8px_8px_0px_var(--foreground)]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="h-full w-full object-cover"
            src="/images/karaoke-usage.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="font-body space-y-6 text-lg font-semibold text-muted-foreground md:text-xl">
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 1:
              </span>{' '}
              Chọn tính năng hát Karaoke và đăng ký bài hát (ví dụ: &quot;Khách
              đến chơi nhà&quot;, &quot;Làng quan họ quê tôi&quot;)
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 2:
              </span>{' '}
              Hát theo giai điệu
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 3:
              </span>{' '}
              Sau khi hát xong, thuật toán học máy sẽ so sánh giọng hát của bạn
              với giọng gốc để chấm điểm. Nếu điểm số vượt tiêu chuẩn, bạn sẽ
              nhận được những phần quà khích lệ từ hệ thống.
            </p>
          </div>
          <div className="border-4 border-dashed border bg-muted p-6">
            <p className="font-body text-lg font-bold text-foreground">
              💡 Mẹo: Giọng hát không cần phải quá hay, chỉ cần đúng giai điệu
              và thể hiện đúng cảm xúc là được!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
