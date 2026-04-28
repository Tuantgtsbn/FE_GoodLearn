import type { CSSProperties } from 'react';
import './style.scss';

const Marquee = ({
  items,
  speed = '20s',
  bgColor = '#333',
  textColor = '#fff',
  fontSize = '1rem',
  pauseOnHover = true,
}) => {
  // Tạo style object để truyền các biến CSS
  const marqueeStyle: CSSProperties = {
    '--speed': speed,
    '--bg-color': bgColor,
    '--text-color': textColor,
    '--font-size': fontSize,
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
