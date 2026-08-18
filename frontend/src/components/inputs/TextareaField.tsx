import { useState } from 'react';
import { Info } from 'lucide-react';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function TextareaField({
  label, value, onChange, tooltip, placeholder, rows = 3, className = '',
}: TextareaFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--grey)',
          }}
        >
          {label}
        </label>
        {tooltip && (
          <div className="relative">
            <Info
              size={12}
              style={{ color: 'var(--grey)', cursor: 'pointer' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div
                className="absolute left-0 top-full mt-1 z-50 px-2 py-1 text-xs whitespace-nowrap"
                style={{
                  background: '#000',
                  border: '1px solid var(--line)',
                  borderLeft: '2px solid var(--red)',
                  color: 'var(--white)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                }}
              >
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-vertical"
        style={{
          background: '#000',
          border: '1px solid var(--line)',
          color: 'var(--white)',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '14px',
          padding: '6px 8px',
          outline: 'none',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--red)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
      />
    </div>
  );
}
