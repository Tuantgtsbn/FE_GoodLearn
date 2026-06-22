import type { CSSProperties } from 'react';
import './style.scss';

const Marquee = ({
  items,
  speed = '20s',
  bgColor = 'transparent',
  textColor = 'inherit',
  fontSize = '1rem',
  pauseOnHover = true,
}: {
  items: React.ReactNode[];
  speed?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  pauseOnHover?: boolean;
}) => {
  // Tạo style object để truyền các biến CSS
  const marqueeStyle: CSSProperties = {
    '--speed': speed,
    '--font-size': fontSize,
    ...(bgColor !== 'transparent' && { '--bg-color': bgColor }),
    ...(textColor !== 'inherit' && { '--text-color': textColor }),
  } as CSSProperties;

  return (
    <div
      className={`marquee-container ${pauseOnHover ? 'pause-on-hover' : ''}`}
      style={marqueeStyle}
    >
      <div className="marquee-content">
        {items.map((text, index) => (
          <span key={index} className="marquee-item">
            {text} •
          </span>
        ))}
      </div>
      {/* Bản sao để tạo hiệu ứng vô tận */}
      <div className="marquee-content" aria-hidden="true">
        {items.map((text, index) => (
          <span key={`dup-${index}`} className="marquee-item">
            {text} •
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
