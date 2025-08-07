import React from 'react';
import GenericDropdown from './GenericDropdown';

export default function DepartmentDropdown({
  inputRef = { current: null },
  dropdownRef = { current: null },
  options = [], 
  searchTerm = '',
  setSearchTerm = () => {},
  selected = null,
  setSelected = () => {},
  closeDropdown = () => {},
  openUpward = false
}) {
  const getOptionLabel = (opt) => opt.name || '';
  const getOptionValue = (opt) => opt.id;
  const filterLogic = (opt, term) => 
    (opt.name || '').toLowerCase().includes(term.toLowerCase());
  const selectionLogic = (value, setSelection) => setSelection(value);
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
      placeholder="Search Department"
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      filterLogic={filterLogic}
      selectionLogic={selectionLogic}
      isDisabledOption={isDisabledOption}
      noOptionsMessage="No departments found"
      maxHeight={200}
      panelStyles={{ borderRadius: 4 }}
      inputStyles={{ padding: '8px', margin: '8px', borderLeft: '1px solid #ccc !important' }}
    />
  );
}
