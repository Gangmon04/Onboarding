import React, { useRef } from 'react';
import GenericDropdown from './GenericDropdown'; // Assuming GenericDropdown.jsx is in the same directory

export default function DurationDropdown({
  inputRef = { current: null },
  dropdownRef = { current: null },
  options = ['15 mins', '30 mins', '45 mins', '1 hour', '1.5 hours', '2 hours'],
  searchTerm = '',
  setSearchTerm = () => {},
  selected = '',
  setSelected = () => {},
  closeDropdown = () => {},
  openUpward = true
}) {
  const getOptionLabel = (opt) => String(opt);
  const getOptionValue = (opt) => String(opt);
  const filterLogic = (opt, term) => String(opt).toLowerCase().includes(term.toLowerCase());
  const selectionLogic = (value, setSelection) => setSelection(value); // Single select
  const isDisabledOption = (opt) => false; // No disabled options for duration

  return (
    <GenericDropdown
      inputRef={inputRef}
      dropdownRef={dropdownRef}
      options={options}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selected={selected}
      setSelected={setSelected}
      closeDropdown={closeDropdown}
      openUpward={openUpward}
      placeholder="Search Duration"
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      filterLogic={filterLogic}
      selectionLogic={selectionLogic}
      isDisabledOption={isDisabledOption}
      maxHeight={130}
      panelStyles={{ borderRadius: 4 }}
      inputStyles={{ padding: 8, margin: 8 }}
    />
  );
}