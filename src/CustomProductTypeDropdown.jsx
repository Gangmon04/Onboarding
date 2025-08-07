import React, { useRef } from 'react';
import GenericDropdown from './GenericDropdown';

export default function ProductTypeDropdown({
  inputRef = { current: null },
  dropdownRef = { current: null },
  options = ['Consultation', 'Investigation', 'Procedure', 'Medication'],
  searchTerm = '',
  setSearchTerm = () => {},
  selected = '',
  setSelected = () => {},
  closeDropdown = () => {},
  openUpward = true
}) {
  const disabledOptions = ['Investigation', 'Procedure', 'Medication'];
  const getOptionLabel = (opt) => String(opt);
  const getOptionValue = (opt) => String(opt);
  const filterLogic = (opt, term) => String(opt).toLowerCase().includes(term.toLowerCase());
  const selectionLogic = (value, setSelection) => setSelection(value); // Single select
  const isDisabledOption = (opt) => disabledOptions.includes(opt);

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
      placeholder="Search Product Type" // Adjusted placeholder
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      filterLogic={filterLogic}
      selectionLogic={selectionLogic}
      isDisabledOption={isDisabledOption}
      maxHeight={85}
      panelStyles={{ borderRadius: 6 }}
      inputStyles={{ padding: 10, margin: 8 }}
    />
  );
}