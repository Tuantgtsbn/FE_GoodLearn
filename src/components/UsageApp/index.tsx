import { lazy, Suspense, useState } from 'react';
import ChatbotUsage from './ChatbotUsage';
import { cn } from '@/lib/utils';
const VideoFlashcardUsage = lazy(() => import('./VideoFlashcardUsage'));
const QuizUsage = lazy(() => import('./QuizUsage'));
const FlashcardUsage = lazy(() => import('./FlashcardUsage'));
const KaraokeUsage = lazy(() => import('./KaraokeUsage'));
const NewsUsage = lazy(() => import('./NewsUsage'));

function UsageApp() {
  const [currentTab, setCurrentTab] = useState<
    'chatbot' | 'video-flashcard' | 'quiz' | 'flashcard' | 'karaoke' | 'news'
  >('chatbot');

  const handleSetTab = (tab: string) => {
    setCurrentTab(
      tab as
        | 'chatbot'
        | 'video-flashcard'
        | 'quiz'
        | 'flashcard'
        | 'karaoke'
        | 'news'
    );
  };

  const tabs = [
    {
      label: '🤖 Chatbot AI',
      tab: 'chatbot',
    },
    {
      label: '📽️ Tạo Video/Flashcard',
      tab: 'video-flashcard',
    },
    {
      label: '📝 Thi Trắc Nghiệm',
      tab: 'quiz',
    },
    {
      label: '🗂️ Học Flashcard',
      tab: 'flashcard',
    },
    {
      label: '🎤 Karaoke Quan Họ',
      tab: 'karaoke',
    },
    {
      label: '📰 Tin tức',
      tab: 'news',
    },
  ];

  const content = (() => {
    switch (currentTab) {
      case 'chatbot':
        return <ChatbotUsage />;
      case 'video-flashcard':
        return <VideoFlashcardUsage />;
      case 'quiz':
        return <QuizUsage />;
      case 'flashcard':
        return <FlashcardUsage />;
      case 'karaoke':
        return <KaraokeUsage />;
      case 'news':
        return <NewsUsage />;
    }
  })();

  return (
    <main className="flex-grow w-full max-w-screen-xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-16">
      <section className="text-center flex flex-col items-center gap-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-zinc-900 translate-x-2 translate-y-2 lg:translate-x-3 lg:translate-y-3"></div>
          <div className="relative bg-white border-4 border-zinc-900 px-8 py-6 lg:px-12 lg:py-8">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-zinc-900">
              📖 Cẩm nang sử dụng GoodLearn
            </h1>
          </div>
        </div>
        <p className="font-body text-xl md:text-2xl font-semibold text-zinc-700 max-w-3xl mt-4">
          Trợ lý AI đồng hành cùng bạn trên con đường tự học.
        </p>
      </section>
      <section className="flex flex-wrap justify-center gap-4">
        {tabs.map((tab) => (
          <a
            className="relative group block cursor-pointer"
            onClick={() => handleSetTab(tab.tab)}
            key={tab.label}
          >
            <div className="absolute inset-0 bg-zinc-900 rounded-full translate-x-1 translate-y-1 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
            <div
              className={cn(
                'relative border-2 rounded-full px-6 py-3 font-bold font-inter whitespace-nowrap transition-colors duration-200',
                tab.tab === currentTab
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-50'
              )}
            >
              {tab.label}
            </div>
          </a>
        ))}
      </section>
      <section className="w-full max-w-5xl mx-auto relative mt-4">
        <div className="absolute inset-0 bg-zinc-900 translate-x-2 translate-y-2 lg:translate-x-3 lg:translate-y-3"></div>
        <Suspense
          fallback={
            <div className="w-full h-[400px] flex justify-center items-center border-4 border-zinc-900 bg-white">
              Đang tải...
            </div>
          }
        >
          {content}
        </Suspense>
      </section>
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-4 border-zinc-900 bg-white p-8 lg:p-12 relative">
        <div className="absolute inset-0 bg-zinc-900 translate-x-2 translate-y-2 -z-10"></div>
        <div className="flex flex-col gap-6">
          <h3 className="font-headline text-3xl font-black uppercase">
            Sẵn sàng trải nghiệm?
          </h3>
          <p className="font-body font-semibold text-zinc-600">
            Sử dụng tài khoản dùng thử để khám phá ngay hôm nay.
          </p>
          <div className="bg-zinc-100 border-2 border-zinc-900 p-4 font-mono text-sm inline-block w-fit">
            <div className="font-bold text-zinc-900 text-lg mb-1">
              Tài khoản Test: test@gmail.com
            </div>

            <div className="font-bold text-zinc-900 text-lg">
              Mật khẩu: 123456789
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UsageApp;
