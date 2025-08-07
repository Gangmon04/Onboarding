import React, { useEffect, useRef, useState, useMemo } from 'react';

export default function GenericDropdown({
  inputRef,
  dropdownRef,
  options,
  searchTerm,
  setSearchTerm,
  selected,
  setSelected,
  closeDropdown,
  openUpward = false,
  placeholder = "Search...",
  // New props for customization:
  getOptionLabel, 
  getOptionValue,
  filterLogic,   
  selectionLogic, 
  isDisabledOption, 
  noOptionsMessage = "No options found",
  maxHeight = 130, 
  panelStyles = {}, 
  inputStyles = {}, 
  optionClass = "" 
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Use useMemo to re-filter only when options, searchTerm, or filterLogic changes
  const filteredOptions = useMemo(() => {
    return options.filter(opt => filterLogic(opt, searchTerm));
  }, [options, searchTerm, filterLogic]);

  const optionsRefs = useRef([]);

  // Handle outside click (common logic)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target) 
      ) {
        closeDropdown();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, closeDropdown, inputRef]);

  // Keyboard navigation (common logic)
  useEffect(() => {
    function handleKeyDown(e) {
      if (!filteredOptions.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % filteredOptions.length);
        optionsRefs.current[(highlightedIndex + 1) % filteredOptions.length]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(i => (i - 1 + filteredOptions.length) % filteredOptions.length);
        optionsRefs.current[(highlightedIndex - 1 + filteredOptions.length) % filteredOptions.length]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          const optionValue = getOptionValue(filteredOptions[highlightedIndex]);
          if (!isDisabledOption(filteredOptions[highlightedIndex])) {
            selectionLogic(optionValue, setSelected, selected);
            setSearchTerm('');
            closeDropdown();
          }
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    }
    const input = inputRef.current;
    if (input) {
      input.addEventListener('keydown', handleKeyDown);
      return () => {
        if (input) input.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [filteredOptions, highlightedIndex, setSelected, closeDropdown, inputRef, setSearchTerm, getOptionValue, selectionLogic, selected, isDisabledOption]);

  // Reset highlight when search changes (common logic)
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm, filteredOptions.length]);

  // Focus input on open (common logic)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div
      ref={dropdownRef} // Assign dropdownRef here
      className={`custom-dropdown-panel ${optionClass}`}
      style={{
        position: 'absolute',
        top: openUpward ? 'auto' : '100%',
        bottom: openUpward ? '100%' : 'auto',
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        ...panelStyles // Merge custom panel styles
      }}
    >
      <div className="custom-dropdown-search-wrapper">
        <input
          ref={inputRef}
          className="custom-dropdown-search-input"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 'calc(100% - 16px)', padding: 8, margin: 8, border: '1px solid #ccc', borderRadius: 4, outline: 'none', fontSize: 15, ...inputStyles }}
        />
      </div>
      <div className="custom-dropdown-options-list" style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
        {filteredOptions.length === 0 ? (
          <div className="custom-dropdown-option no-results">{noOptionsMessage}</div>
        ) : (
          filteredOptions.map((opt, idx) => {
            const optionValue = getOptionValue(opt);
            const optionLabel = getOptionLabel(opt);
            const isDisabled = isDisabledOption(opt);
            const isSelected = Array.isArray(selected) ? selected.includes(optionValue) : selected === optionValue;

            return (
              <div
                key={optionValue}
                ref={el => optionsRefs.current[idx] = el}
                onClick={e => {
                  e.stopPropagation();
                  if (!isDisabled) {
                    selectionLogic(optionValue, setSelected, selected);
                    setSearchTerm('');
                    closeDropdown();
                  }
                }}
                className={`custom-dropdown-option ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${highlightedIndex === idx ? 'hovered' : ''}`}
                onMouseEnter={() => !isDisabled && setHighlightedIndex(idx)}
              >
                {isSelected && <span className="tick">✔</span>}
                <span>{optionLabel}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}