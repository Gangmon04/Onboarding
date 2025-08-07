import React, { useRef } from 'react';
import GenericDropdown from './GenericDropdown';

export default function SpecialtyDropdown({
  inputRef = { current: null },
  dropdownRef = { current: null },
  options = [], 
  searchTerm = '',
  setSearchTerm = () => {},
  selected = null, // This would be the 'id' of the selected specialty
  setSelected = () => {},
  closeDropdown = () => {},
  openUpward = false
}) {
  const getOptionLabel = (opt) => opt.Name;
  const getOptionValue = (opt) => opt.id;
  const filterLogic = (opt, term) => opt.Name.toLowerCase().includes(term.toLowerCase());
  const selectionLogic = (value, setSelection) => setSelection(value); // Single select
  const isDisabledOption = (opt) => false;

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
      placeholder="Search Specialty"
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      filterLogic={filterLogic}
      selectionLogic={selectionLogic}
      isDisabledOption={isDisabledOption}
      noOptionsMessage="No specialties found"
      maxHeight={83}
      panelStyles={{ borderRadius: 4 }}
      inputStyles={{ padding: '8px', margin: '8px', borderLeft: '1px solid #ccc !important' }}
    />
  );
}