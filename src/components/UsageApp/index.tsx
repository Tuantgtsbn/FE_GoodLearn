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
    { label: '🤖 Chatbot AI', tab: 'chatbot' },
    { label: '📽️ Tạo Video/Flashcard', tab: 'video-flashcard' },
    { label: '📝 Thi Trắc Nghiệm', tab: 'quiz' },
    { label: '🗂️ Học Flashcard', tab: 'flashcard' },
    { label: '🎤 Karaoke Quan Họ', tab: 'karaoke' },
    { label: '📰 Tin tức', tab: 'news' },
  ];

  const content = (() => {
    switch (currentTab) {
      case 'chatbot':
        return <ChatbotUsage />;
      case 'video-flashcard':
        return (
          <Suspense
            fallback={
              <div className="flex h-[400px] items-center justify-center border-4 border bg-background">
                Đang tải...
              </div>
            }
          >
            <VideoFlashcardUsage />
          </Suspense>
        );
      case 'quiz':
        return (
          <Suspense
            fallback={
              <div className="flex h-[400px] items-center justify-center border-4 border bg-background">
                Đang tải...
              </div>
            }
          >
            <QuizUsage />
          </Suspense>
        );
      case 'flashcard':
        return (
          <Suspense
            fallback={
              <div className="flex h-[400px] items-center justify-center border-4 border bg-background">
                Đang tải...
              </div>
            }
          >
            <FlashcardUsage />
          </Suspense>
        );
      case 'karaoke':
        return (
          <Suspense
            fallback={
              <div className="flex h-[400px] items-center justify-center border-4 border bg-background">
                Đang tải...
              </div>
            }
          >
            <KaraokeUsage />
          </Suspense>
        );
      case 'news':
        return (
          <Suspense
            fallback={
              <div className="flex h-[400px] items-center justify-center border-4 border bg-background">
                Đang tải...
              </div>
            }
          >
            <NewsUsage />
          </Suspense>
        );
    }
  })();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-grow flex-col gap-16 px-6 py-12 md:py-20">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground dark:bg-[#3c3a3a] lg:translate-x-3 lg:translate-y-3" />
          <div className="relative border-4 bg-background px-8 py-6 lg:px-12 lg:py-8">
            <h1 className="font-headline text-4xl font-black uppercase tracking-tighter text-foreground md:text-6xl lg:text-7xl">
              📖 Cẩm nang sử dụng GoodLearn
            </h1>
          </div>
        </div>
        <p className="font-body mt-4 max-w-3xl text-xl font-semibold text-muted-foreground md:text-2xl">
          Trợ lý AI đồng hành cùng bạn trên con đường tự học.
        </p>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap justify-center gap-4">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            className="group relative block cursor-pointer"
            onClick={() => handleSetTab(tab.tab)}
          >
            <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-full bg-foreground transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
            <div
              className={cn(
                'relative rounded-full border-2 px-6 py-3 font-bold whitespace-nowrap transition-colors duration-200',
                tab.tab === currentTab
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border hover:bg-muted'
              )}
            >
              {tab.label}
            </div>
          </a>
        ))}
      </section>

      {/* Content */}
      <section className="relative mx-auto mt-4 w-full max-w-5xl">
        <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground dark:bg-[#3c3a3a] lg:translate-x-3 lg:translate-y-3" />
        <Suspense
          fallback={
            <div className="flex h-[400px] items-center justify-center border-4 bg-background">
              Đang tải...
            </div>
          }
        >
          {content}
        </Suspense>
      </section>

      {/* Test account CTA */}
      <section className="relative mt-12 grid grid-cols-1 items-center gap-8 border-4 bg-background p-8 md:grid-cols-2 lg:p-12">
        <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground dark:bg-[#3c3a3a] -z-10" />
        <div className="flex flex-col gap-6">
          <h3 className="font-headline text-3xl font-black uppercase text-foreground">
            Sẵn sàng trải nghiệm?
          </h3>
          <p className="font-body font-semibold text-muted-foreground">
            Sử dụng tài khoản dùng thử để khám phá ngay hôm nay.
          </p>
          <div className="inline-block w-fit border-2 bg-muted p-4 font-mono text-sm">
            <div className="mb-1 text-lg font-bold text-foreground">
              Tài khoản Test: test@gmail.com
            </div>
            <div className="text-lg font-bold text-foreground">
              Mật khẩu: 123456789
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UsageApp;
