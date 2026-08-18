import { useState, useMemo } from 'react';
import { Info, Delete } from 'lucide-react';

const MAX_GLYPHS = 12;
const HEX_GLYPHS = Array.from({ length: 16 }, (_, i) => i.toString(16).toUpperCase());

interface GlyphInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
}

export default function GlyphInput({ label, value, onChange, tooltip }: GlyphInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Filter to only valid hex chars, uppercase
  const cleaned = useMemo(() =>
    value.toUpperCase().split('').filter(c => HEX_GLYPHS.includes(c)).join(''),
  [value]);

  // Sync cleaning back up if needed
  if (cleaned !== value) {
    // We don't call onChange here to avoid loops; the lint happens naturally on input
  }

  const handleAddGlyph = (g: string) => {
    if (cleaned.length >= MAX_GLYPHS) return;
    onChange(cleaned + g);
  };

  const handleRemove = () => {
    onChange(cleaned.slice(0, -1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.toUpperCase().split('').filter(c => HEX_GLYPHS.includes(c)).join('').slice(0, MAX_GLYPHS);
    onChange(filtered);
  };

  return (
    <div className="relative">
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

      {/* Input field + delete button */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={cleaned}
          onChange={handleInputChange}
          placeholder="Introduce glifos..."
          maxLength={MAX_GLYPHS}
          className="flex-1"
          style={{
            background: '#000',
            border: '1px solid var(--line)',
            color: 'var(--red)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            padding: '6px 8px',
            outline: 'none',
            textTransform: 'uppercase',
            textShadow: '0 0 8px rgba(229, 35, 45, 0.55)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--red)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
        />
        {cleaned.length > 0 && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1 px-2 py-1 transition-colors"
            style={{
              background: '#000',
              border: '1px solid var(--line)',
              color: 'var(--red)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(229,35,45,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = '#000'; }}
          >
            <Delete size={14} />
            Borrar
          </button>
        )}
      </div>

      {/* Hex glyph grid — 8 columns */}
      <div
        className="grid gap-px mb-2"
        style={{
          gridTemplateColumns: 'repeat(8, 60px)',
        }}
      >
        {HEX_GLYPHS.map((g) => {
          const count = (cleaned.match(new RegExp(g, 'g')) || []).length;
          const isDisabled = cleaned.length >= MAX_GLYPHS;
          return (
            <button
              key={g}
              type="button"
              onClick={() => handleAddGlyph(g)}
              disabled={isDisabled}
              className={`glyphs ${count > 0 ? 'text-[var(--red)]' : 'text-[var(--grey)]'}`}
              style={{
                background: count > 0 ? 'rgba(229, 35, 45, 0.15)' : '#000',
                border: `1px solid ${count > 0 ? 'var(--red)' : 'var(--line)'}`,
                padding: '4px 0',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled && count === 0 ? 0.4 : 1,
                transition: 'all 0.15s ease',
                height: '36px',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.borderColor = 'var(--red)';
                  e.currentTarget.style.background = 'rgba(229,35,45,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled || count === 0) {
                  e.currentTarget.style.borderColor = count > 0 ? 'var(--red)' : 'var(--line)';
                  e.currentTarget.style.background = count > 0 ? 'rgba(229, 35, 45, 0.15)' : '#000';
                }
              }}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <div
        className="glyphs preview w-full px-3 py-2"
        style={{
          background: '#000',
          border: '1px solid var(--line)',
          minHeight: '38px',
          wordBreak: 'break-all',
        }}
      >
        {cleaned || (
          <span className="text-[var(--grey)]" style={{ fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {`${'•'.repeat(MAX_GLYPHS)}`}
          </span>
        )}
      </div>
    </div>
  );
}
