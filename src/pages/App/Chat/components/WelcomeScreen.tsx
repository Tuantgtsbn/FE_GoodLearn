import { Bot, FlaskConical, BookOpen, Pencil, Calculator } from 'lucide-react';

interface WelcomeScreenProps {
  onSendStarter: (content: string) => void;
}

const STARTERS = [
  {
    icon: <FlaskConical size={18} />,
    title: 'Giải thích Vật lý',
    desc: 'Hiểu các khái niệm phức tạp một cách đơn giản.',
    prompt:
      'Giải thích cho mình về nguyên lý bảo toàn năng lượng một cách dễ hiểu',
    color: '#eef2ff',
    iconColor: '#4f46e5',
  },
  {
    icon: <BookOpen size={18} />,
    title: 'Tạo Flashcard',
    desc: 'Tạo bộ thẻ ghi nhớ từ nội dung bài học.',
    prompt:
      'Tạo bộ flashcard 5 thẻ cho chủ đề Lịch sử Việt Nam - Kháng chiến chống Pháp',
    color: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    icon: <Pencil size={18} />,
    title: 'Sửa bài luận',
    desc: 'Kiểm tra ngữ pháp và cải thiện văn phong.',
    prompt:
      'Giúp mình kiểm tra ngữ pháp và cải thiện bài văn nghị luận xã hội về chủ đề giáo dục',
    color: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    icon: <Calculator size={18} />,
    title: 'Giải bài Toán',
    desc: 'Giải chi tiết từng bước, dễ hiểu.',
    prompt: 'Giải phương trình: x² - 5x + 6 = 0 và giải thích từng bước',
    color: '#d1fae5',
    iconColor: '#059669',
  },
];

export default function WelcomeScreen({ onSendStarter }: WelcomeScreenProps) {
  return (
    <div className="chat-welcome">
      <div className="chat-welcome__mascot">
        <Bot strokeWidth={1.5} />
      </div>

      <div className="chat-welcome__greeting">
        <h2>Sẵn sàng học tập?</h2>
        <p>
          Hỏi mình bất cứ điều gì hoặc chọn một gợi ý bên dưới để bắt đầu phiên
          học tập của bạn.
        </p>
      </div>

      <div className="chat-welcome__starters">
        {STARTERS.map((starter, i) => (
          <button
            key={i}
            className="chat-welcome__starter"
            onClick={() => onSendStarter(starter.prompt)}
          >
            <div
              className="chat-welcome__starter-icon"
              style={{ background: starter.color, color: starter.iconColor }}
            >
              {starter.icon}
            </div>
            <div className="chat-welcome__starter-content">
              <div className="chat-welcome__starter-title">{starter.title}</div>
              <div className="chat-welcome__starter-desc">{starter.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
