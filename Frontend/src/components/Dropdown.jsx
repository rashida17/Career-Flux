import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const triggerBase =
  'flex items-center text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40';

// "field" matches the search fields in the hero. "compact" is the small sort button.
const triggerVariants = {
  field: {
    base: 'min-h-[50px] w-full gap-3 rounded-xl border px-3.5 sm:rounded-2xl',
    closed: 'border-transparent bg-stone-50 hover:bg-stone-100',
    open: 'border-brand-300 bg-white',
  },
  compact: {
    base: 'min-w-[11rem] justify-between gap-2 rounded-lg border py-1.5 pl-3 pr-2.5',
    closed: 'border-slate-200 bg-white hover:border-slate-300',
    open: 'border-brand-300 bg-white',
  },
};

const panelVariants = {
  field: 'left-0 right-0',
  compact: 'right-0 w-56',
};

export default function Dropdown({
  id,
  ariaLabel,
  value,
  onChange,
  options, // [{ value, label }]
  placeholder,
  icon: Icon,
  variant = 'field',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // option highlighted by mouse or keyboard
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];
  const showPlaceholder = Boolean(placeholder) && value === '';
  const buttonText = showPlaceholder ? placeholder : selected?.label ?? placeholder ?? '';

  const listId = `${id}-list`;
  const optionId = (i) => `${id}-option-${i}`;
  const v = triggerVariants[variant];

  // Close when the user clicks anywhere outside
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // Keep the highlighted option visible when the list scrolls
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const openList = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const choose = (index) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    const last = options.length - 1;

    // Closed: arrows, Enter or Space open the list
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, last));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const textClass = showPlaceholder
    ? 'font-medium text-stone-500'
    : variant === 'field'
      ? 'font-semibold text-slate-800'
      : 'font-medium text-slate-700';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        aria-label={ariaLabel ? `${ariaLabel}: ${buttonText}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`${triggerBase} ${v.base} ${open ? v.open : v.closed}`}
      >
        {Icon && <Icon className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />}
        <span className={`min-w-0 flex-1 truncate text-sm ${textClass}`}>{buttonText}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* List. onMouseDown keeps keyboard focus on the trigger while clicking. */}
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={ariaLabel}
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute top-full z-30 mt-2 max-h-72 overflow-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg shadow-slate-900/5 transition-[opacity,transform,visibility] duration-150 motion-reduce:transition-none ${panelVariants[variant]} ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        {options.map((option, i) => {
          const isSelected = i === selectedIndex;
          const isActive = i === activeIndex;

          return (
            <li
              key={option.value || 'all'}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                isSelected ? 'font-semibold text-brand-700' : 'text-slate-700'
              } ${isActive ? 'bg-stone-100' : ''}`}
            >
              <span className="truncate">{option.label}</span>
              {isSelected && (
                <Check className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}