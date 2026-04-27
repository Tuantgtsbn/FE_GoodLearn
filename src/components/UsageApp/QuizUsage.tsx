export default function QuizUsage() {
  return (
    <div className="relative bg-white border-4 border-zinc-900 p-8 lg:p-12 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b-4 border-zinc-900 pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase text-zinc-900">
          Hướng dẫn thi trắc nghiệm
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] w-full border-4 border-zinc-900 bg-zinc-50 overflow-hidden relative shadow-[8px_8px_0px_#18181b]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="w-full h-full object-contain"
            src="/images/exam-usage.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="space-y-6 font-body font-semibold text-zinc-800 text-lg md:text-xl">
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 1:
              </span>{' '}
              Truy cập mục "Thi trắc nghiệm" và chọn bài thi phù hợp với khối
              lớp hoặc môn học mong muốn.
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 2:
              </span>{' '}
              Tiến hành làm bài trực tiếp trên giao diện. Sau khi hoàn thành,
              nhấn "Nộp bài".
            </p>
            <p>
              <span className="underline decoration-4 underline-offset-4 font-black text-zinc-900">
                Bước 3:
              </span>{' '}
              Hệ thống sẽ chấm điểm tự động, xếp hạng thành tích và gửi lại đáp
              án chi tiết để học sinh đối soát, kiểm tra lại kiến thức.
            </p>
          </div>
          <div className="border-4 border-dashed border-zinc-900 p-6 bg-zinc-50">
            <p className="font-body font-bold text-zinc-900 text-lg">
              💡 Mẹo: Hãy thường xuyên làm bài trắc nghiệm để củng cố và nâng
              cao kiến thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
