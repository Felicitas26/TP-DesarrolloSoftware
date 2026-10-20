import { useMemo, useState } from "react";
import "./CityAutocomplete.css";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getCityLabel = (loc) => loc.city || loc.name || "";
const getZipCode = (loc) => (loc.zipCode ?? loc.zip_code ?? "").toString();

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
  maxResults = 8,
  hasError = false,
}) {
  const inputId = id || "city-autocomplete";
  const listId = `${inputId}-list`;

  const [query, setQuery] = useState(value || "");
  const [lastValue, setLastValue] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  if ((value || "") !== lastValue) {
    setLastValue(value || "");
    setQuery(value || "");
  }

  const matches = useMemo(() => {
    const term = normalize(query);
    if (!term) return locations.slice(0, maxResults);
    return locations
      .filter((loc) => normalize(getCityLabel(loc)).includes(term))
      .slice(0, maxResults);
  }, [query, locations, maxResults]);

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
      setOpen(true);
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

  return (
    <div className="city-autocomplete">
      <input
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
          setOpen(true);
        }}
        onFocus={() => {
          if (locations.length) setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setOpen(false);
            settleOnBlur();
          }, 0);
        }}
        onKeyDown={handleKeyDown}
      />

      {open && matches.length > 0 && (
        <ul className="city-autocomplete__list" id={listId} role="listbox">
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
        </ul>
      )}

      {showEmpty && (
        <div className="city-autocomplete__empty">Sin resultados</div>
      )}
    </div>
  );
}

export default CityAutocomplete;
