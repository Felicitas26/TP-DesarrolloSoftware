import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CityAutocomplete.css";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getCityLabel = (loc) => loc.city || loc.name || "";
const getZipCode = (loc) => (loc.zipCode ?? loc.zip_code ?? "").toString();

const DROPDOWN_GAP = 4;
const DROPDOWN_MAX_HEIGHT = 240;

function CityAutocomplete({
  id,
  name,
  value = "",
  locations = [],
  onSelect,
  onClear,
  placeholder = "Escribí para buscar...",
  className = "",
  disabled = false,
  autoComplete = "off",
  hasError = false,
}) {
  const inputId = id || "city-autocomplete";
  const listId = `${inputId}-list`;
  const inputRef = useRef(null);

  const [query, setQuery] = useState(value || "");
  const [lastValue, setLastValue] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [position, setPosition] = useState(null);

  if ((value || "") !== lastValue) {
    setLastValue(value || "");
    setQuery(value || "");
  }

  const matches = useMemo(() => {
    const term = normalize(query);
    if (!term) return locations;
    return locations.filter((loc) =>
      normalize(getCityLabel(loc)).includes(term)
    );
  }, [query, locations]);

  const updatePosition = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const rect = input.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - DROPDOWN_GAP - 8;
    const spaceAbove = rect.top - DROPDOWN_GAP - 8;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const available = openUp ? spaceAbove : spaceBelow;

    setPosition({
      left: rect.left,
      width: rect.width,
      top: openUp ? null : rect.bottom + DROPDOWN_GAP,
      bottom: openUp ? window.innerHeight - rect.top + DROPDOWN_GAP : null,
      maxHeight: Math.max(96, Math.min(DROPDOWN_MAX_HEIGHT, available)),
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleViewportChange = () => updatePosition();

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [open, updatePosition]);

  const openList = () => {
    updatePosition();
    setOpen(true);
  };

  const commit = (loc) => {
    setQuery(getCityLabel(loc));
    setOpen(false);
    setHighlighted(-1);
    onSelect?.(loc);
  };

  const settleOnBlur = () => {
    const term = normalize(query);

    if (!term) {
      if (value) onClear?.();
      setQuery("");
      return;
    }

    const exact = locations.find((loc) => normalize(getCityLabel(loc)) === term);
    if (exact) {
      commit(exact);
    } else {
      setQuery(value || "");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openList();
      if (matches.length) {
        setHighlighted((prev) => Math.min(prev + 1, matches.length - 1));
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (matches.length) {
        setHighlighted((prev) => Math.max(prev - 1, 0));
      }
    } else if (event.key === "Enter") {
      if (open && matches.length) {
        event.preventDefault();
        commit(matches[highlighted < 0 ? 0 : highlighted]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(value || "");
    }
  };

  const showEmpty = open && matches.length === 0 && normalize(query) !== "";

  const dropdownStyle = position
    ? {
        position: "fixed",
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxHeight: `${position.maxHeight}px`,
        ...(position.top != null ? { top: `${position.top}px` } : {}),
        ...(position.bottom != null ? { bottom: `${position.bottom}px` } : {}),
      }
    : undefined;

  return (
    <div className="city-autocomplete">
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          open && matches[highlighted] ? `${inputId}-opt-${highlighted}` : undefined
        }
        autoComplete={autoComplete}
        className={`city-autocomplete__input ${hasError ? "input-error" : ""} ${className}`.trim()}
        value={query}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => {
          setQuery(event.target.value);
          setHighlighted(-1);
          openList();
        }}
        onFocus={() => {
          if (locations.length) openList();
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setOpen(false);
            settleOnBlur();
          }, 0);
        }}
        onKeyDown={handleKeyDown}
      />

      {open && position && matches.length > 0 &&
        createPortal(
          <ul
            className="city-autocomplete__list city-autocomplete__list--portal"
            id={listId}
            role="listbox"
            style={dropdownStyle}
          >
            {matches.map((loc, index) => (
              <li
                key={`${getCityLabel(loc)}-${getZipCode(loc)}-${index}`}
                id={`${inputId}-opt-${index}`}
                role="option"
                aria-selected={index === highlighted}
                className={`city-autocomplete__option${
                  index === highlighted ? " is-highlighted" : ""
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(loc);
                }}
                onMouseEnter={() => setHighlighted(index)}
              >
                <span className="city-autocomplete__city">{getCityLabel(loc)}</span>
                {getZipCode(loc) && (
                  <span className="city-autocomplete__zip">CP: {getZipCode(loc)}</span>
                )}
              </li>
            ))}
          </ul>,
          document.body
        )}

      {showEmpty && position &&
        createPortal(
          <div
            className="city-autocomplete__empty city-autocomplete__empty--portal"
            style={dropdownStyle}
          >
            Sin resultados
          </div>,
          document.body
        )}
    </div>
  );
}

export default CityAutocomplete;
