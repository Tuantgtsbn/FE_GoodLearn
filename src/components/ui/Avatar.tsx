import React, { useState, type CSSProperties } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'rounded' | 'square';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string | null;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_PAIRS: [string, string][] = [['#FF6B6B', '#C0392B']];

const SIZE_CONFIG: Record<
  AvatarSize,
  {
    boxSize: string;
    fontSize: string;
    ring: number;
    statusSize: string;
    statusOffset: string;
  }
> = {
  xs: {
    boxSize: 'w-8 h-8',
    fontSize: 'text-[13px]',
    ring: 2,
    statusSize: 'w-2 h-2',
    statusOffset: '-bottom-0.5 -right-0.5',
  },
  sm: {
    boxSize: 'w-10 h-10',
    fontSize: 'text-[15px]',
    ring: 2.5,
    statusSize: 'w-2.5 h-2.5',
    statusOffset: '-bottom-0.5 -right-0.5',
  },
  md: {
    boxSize: 'w-13 h-13',
    fontSize: 'text-[19px]',
    ring: 3,
    statusSize: 'w-3 h-3',
    statusOffset: 'bottom-0 right-0',
  },
  lg: {
    boxSize: 'w-18 h-18',
    fontSize: 'text-[27px]',
    ring: 3.5,
    statusSize: 'w-3.5 h-3.5',
    statusOffset: 'bottom-0 right-0',
  },
  xl: {
    boxSize: 'w-24 h-24',
    fontSize: 'text-[37px]',
    ring: 4,
    statusSize: 'w-4.5 h-4.5',
    statusOffset: 'bottom-0.5 right-0.5',
  },
};

const SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-[22%]',
  square: 'rounded-lg',
};

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: '#22C55E',
  offline: '#94A3B8',
  busy: '#EF4444',
  away: '#F59E0B',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getColorPair(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name = '',
      src,
      size = 'md',
      shape = 'circle',
      status,
      className,
      ...props
    },
    ref
  ) => {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

    const normalizedSrc = (() => {
      if (!src) return null;
      const trimmedSrc = src.trim();
      const lowerSrc = trimmedSrc.toLowerCase();
      if (!trimmedSrc || lowerSrc === 'null' || lowerSrc === 'undefined') {
        return null;
      }
      return trimmedSrc;
    })();

    const cfg = SIZE_CONFIG[size];
    const shapeClass = SHAPE_CLASSES[shape];
    const showImage = Boolean(normalizedSrc && failedSrc !== normalizedSrc);
    const initials = getInitials(name);
    const [c1, c2] = getColorPair(name);

    // Dynamic styles that can't be expressed with static Tailwind classes
    const gradientStyle: CSSProperties = {
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
    };

    const glowStyle: CSSProperties = {
      ...gradientStyle,
      inset: -cfg.ring,
      borderRadius: 'inherit',
      opacity: 0.35,
    };

    const bodyStyle: CSSProperties = showImage
      ? { boxShadow: `0 4px 14px ${c1}44` }
      : { ...gradientStyle, boxShadow: `0 4px 14px ${c1}44` };

    const statusDotStyle: CSSProperties = {
      background: STATUS_COLORS[status as AvatarStatus],
      border: `${Math.max(2, cfg.ring)}px solid #1A1D27`,
      boxShadow: `0 0 0 1px ${STATUS_COLORS[status as AvatarStatus]}44`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center shrink-0',
          cfg.boxSize,
          shapeClass,
          props.onClick && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {/* Avatar body */}
        <div
          className={cn(
            'relative w-full h-full overflow-hidden flex items-center justify-center',
            shapeClass,
            showImage && 'bg-black'
          )}
          style={bodyStyle}
        >
          {/* Highlight overlay for fallback */}
          {!showImage && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%),' +
                  'radial-gradient(circle at 70% 70%, rgba(0,0,0,0.15) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
          )}

          {/* Image */}
          {normalizedSrc && (
            <img
              src={normalizedSrc}
              alt={name || 'avatar'}
              onError={() => {
                if (normalizedSrc) {
                  setFailedSrc(normalizedSrc);
                }
              }}
              onLoad={() => {
                if (normalizedSrc) {
                  setLoadedSrc(normalizedSrc);
                  setFailedSrc(null);
                }
              }}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                loadedSrc === normalizedSrc ? 'opacity-100' : 'opacity-0'
              )}
            />
          )}

          {/* Initials fallback */}
          {!showImage && (
            <span
              className={cn(
                'relative z-20 font-bold leading-none select-none text-white tracking-tight',
                cfg.fontSize
              )}
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
            >
              {initials || '?'}
            </span>
          )}
        </div>

        {/* Status dot */}
        {status && (
          <span
            className={cn(
              'absolute z-20 rounded-full',
              cfg.statusSize,
              cfg.statusOffset
            )}
            style={statusDotStyle}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
