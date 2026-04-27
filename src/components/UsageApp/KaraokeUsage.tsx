export default function KaraokeUsage() {
  return (
    <div className="relative bg-white border-4 border-zinc-900 p-8 lg:p-12 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b-4 border-zinc-900 pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase text-zinc-900">
          Hướng dẫn sử dụng Karaoke Quan họ
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] w-full border-4 border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-[8px_8px_0px_#18181b]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="w-full h-full object-cover"
            src="/images/karaoke-usage.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-6 font-body font-semibold text-zinc-800 text-lg md:text-xl">
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 1:
              </span>{' '}
              Chọn tính năng hát Karaoke và đăng ký bài hát (ví dụ: "Khách đến
              chơi nhà", "Làng quan họ quê tôi")
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 2:
              </span>{' '}
              Hát theo giai điệu
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 3:
              </span>{' '}
              Sau khi hát xong, thuật toán học máy sẽ so sánh giọng hát của bạn
              với giọng gốc để chấm điểm. Nếu điểm số vượt tiêu chuẩn, bạn sẽ
              nhận được những phần quà khích lệ từ hệ thống.
            </p>
          </div>
          <div className="border-4 border-dashed border-zinc-900 p-6 bg-zinc-50">
            <p className="font-body font-bold text-zinc-900 text-lg">
              💡 Mẹo: Giọng hát không cần phải quá hay, chỉ cần đúng giai điệu
              và thể hiện đúng cảm xúc là được!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
