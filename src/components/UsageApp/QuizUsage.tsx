export default function QuizUsage() {
  return (
    <div className="relative flex flex-col gap-8 border-4 border bg-background p-8 lg:p-12">
      <div className="flex items-center gap-4 border-b-4 border pb-4">
        <span className="text-4xl">🤖</span>
        <h2 className="font-headline text-2xl font-black uppercase text-foreground md:text-3xl">
          Hướng dẫn thi trắc nghiệm
        </h2>
      </div>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border bg-muted shadow-[8px_8px_0px_var(--foreground)]">
          <img
            alt="doodle style line art illustration of a friendly robot answering questions on a notebook paper background"
            className="h-full w-full object-contain"
            src="/images/exam-usage.png"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="font-body space-y-6 text-lg font-semibold text-muted-foreground md:text-xl">
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 1:
              </span>{' '}
              Truy cập mục &quot;Thi trắc nghiệm&quot; và chọn bài thi phù hợp
              với khối lớp hoặc môn học mong muốn.
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 2:
              </span>{' '}
              Tiến hành làm bài trực tiếp trên giao diện. Sau khi hoàn thành,
              nhấn &quot;Nộp bài&quot;.
            </p>
            <p>
              <span className="font-black text-foreground underline decoration-4 underline-offset-4">
                Bước 3:
              </span>{' '}
              Hệ thống sẽ chấm điểm tự động, xếp hạng thành tích và gửi lại đáp
              án chi tiết để học sinh đối soát, kiểm tra lại kiến thức.
            </p>
          </div>
          <div className="border-4 border-dashed border bg-muted p-6">
            <p className="font-body text-lg font-bold text-foreground">
              💡 Mẹo: Hãy thường xuyên làm bài trắc nghiệm để củng cố và nâng
              cao kiến thức.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
