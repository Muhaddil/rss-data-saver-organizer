import { useState, useRef, useEffect } from 'react';
import { Info, Search } from 'lucide-react';

interface AutocompleteFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  tooltip?: string;
  placeholder?: string;
  className?: string;
}

export default function AutocompleteField({
  label, value, onChange, options, tooltip, placeholder = 'Buscar...', className = '',
}: AutocompleteFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [focused, setFocused] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setFiltered(options.filter((o) => o.toLowerCase().includes(value.toLowerCase())).slice(0, 20));
    } else {
      setFiltered([]);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
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
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--grey)' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setFocused(true);
            if (value) setShowDropdown(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full"
          style={{
            background: '#000',
            border: `1px solid ${focused ? 'var(--red)' : 'var(--line)'}`,
            color: 'var(--white)',
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: '14px',
            padding: '6px 8px 6px 30px',
            outline: 'none',
          }}
        />
      </div>
      {showDropdown && filtered.length > 0 && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto"
          style={{
            background: '#000',
            border: '1px solid var(--line)',
            borderLeft: '2px solid var(--red)',
          }}
        >
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              className="w-full text-left px-3 py-1.5 text-sm transition-colors"
              style={{
                color: 'var(--white)',
                fontFamily: "'Hanken Grotesk', sans-serif",
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 35, 45, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              onClick={() => {
                onChange(opt);
                setShowDropdown(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
