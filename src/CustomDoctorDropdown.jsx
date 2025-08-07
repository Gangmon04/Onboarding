import React, { useRef } from 'react';
import GenericDropdown from './GenericDropdown';

export default function DoctorDropdown({
  inputRef = { current: null },
  dropdownRef = { current: null },
  options = [], 
  selected = [],
  setSelected = () => {}, 
  searchTerm = '',
  setSearchTerm = () => {},
  closeDropdown = () => {},
  openUpward = false
}) {
  const getOptionLabel = (d) => d.full_name || d.first_name || d.name || '';
  const getOptionValue = (d) => d.id;
  const filterLogic = (d, term) =>
    (d.full_name || d.first_name || d.name || '').toLowerCase().includes(term.toLowerCase());

  // Custom selection logic for multi-select
  const selectionLogic = (value, setSelection, currentSelected) => {
    console.log('Selection triggered with value:', value);
    console.log('Current selected before update:', currentSelected);
    
    let newSelection;
    if (currentSelected.includes(value)) {
      newSelection = currentSelected.filter(sid => sid !== value);
    } else {
      newSelection = [...currentSelected, value];
    }
    
    console.log('New selection:', newSelection);
    setSelection(newSelection);
  };
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
      placeholder="Search Doctor"
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      filterLogic={filterLogic}
      selectionLogic={selectionLogic}
      isDisabledOption={isDisabledOption}
      noOptionsMessage="No doctors found"
      maxHeight={130}
      panelStyles={{ borderRadius: 4 }}
      inputStyles={{ padding: 8, margin: 8 }}
    />
  );
}