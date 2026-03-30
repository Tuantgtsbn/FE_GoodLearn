import { Mic } from 'lucide-react';

export default function Voicecall() {
  return (
    <>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 gap-8">
        <div className="animate-fade-in-down">
          <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-[#1c2433] border border-black/10 dark:border-white/10 shadow-sm">
            <span className="material-symbols-outlined text-primary text-sm">
              school
            </span>
            <p className="text-sm font-semibold tracking-wide text-[#111318] dark:text-white">
              Luyện Speaking - Unit 5
            </p>
          </div>
        </div>
        <div className="flex h-48 w-full items-center justify-center gap-1.5 sm:gap-3 my-4">
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-12"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-24"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-16"></div>
          <div className="bar w-2 sm:w-3 bg-primary h-32"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-40"></div>
          <div className="bar w-2 sm:w-3 bg-primary h-28"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-20"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-36"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-14"></div>
          <div className="bar w-2 sm:w-3 bg-[#111318] dark:bg-white h-8"></div>
        </div>
        <div className="w-full max-w-2xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[#111318] dark:text-white">
            I think the environment is...
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-[#616f89] dark:text-slate-400 text-base font-normal">
              Mình đang nghe, bạn nói tiếp đi...
            </p>
          </div>
        </div>
      </main>
      <footer className="relative z-10 w-full pb-10 pt-4 px-6">
        <div className="mx-auto flex max-w-[400px] items-center justify-between gap-6">
          <button
            aria-label="Toggle Microphone"
            className="group flex size-14 items-center justify-center rounded-full border-2 border-[#111318] dark:border-white bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
          >
            <Mic />
          </button>
          <button
            aria-label="End Session"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#111318] dark:bg-white text-white dark:text-[#111318] shadow-lg hover:bg-black/80 dark:hover:bg-gray-200 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span className="text-sm font-bold tracking-widest">
              KẾT
              <br />
              THÚC
            </span>
          </button>
        </div>
      </footer>
    </>
  );
}
