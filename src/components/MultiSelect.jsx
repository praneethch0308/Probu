import React, { useState } from 'react';

const MultiSelect = ({ options, selectedOptions, onChange, register, name }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionChange = (event, option) => {
    const newSelectedOptions = event.target.checked
      ? [...selectedOptions, option]
      : selectedOptions.filter(selectedOption => selectedOption.projId !== option.projId);

    onChange(newSelectedOptions);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="multi-select">
      <div className="multi-select__selected" onClick={toggleDropdown}>
        {selectedOptions.map(option => option.projName).join(', ') || 'Select projects'}
      </div>
      {isOpen && (
        <div className="multi-select__options">
          {options.map(option => (
            <div key={option.projId}>
              <input
                type="checkbox"
                id={option.projId}
                value={option.projId}
                checked={selectedOptions.some(selectedOption => selectedOption.projId === option.projId)}
                onChange={(e) => handleOptionChange(e, option)}
              />
              <label htmlFor={option.projId}>{option.projName}</label>
            </div>
          ))}
        </div>
      )}
      {/* Register the multi-select with react-hook-form */}
      <input type="hidden" name={name} ref={register} value={JSON.stringify(selectedOptions)} />
    </div>
  );
};

export default MultiSelect;
