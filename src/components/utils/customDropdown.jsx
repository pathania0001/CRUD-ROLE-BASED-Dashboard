import { Check, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

const CustomDropdown = ({ columnFilters, handleSelectChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (column) => {
    setSelectedColumn(column);
    handleSelectChange && handleSelectChange(column);
    setIsOpen(false); 
  };

  return (
    <div className="relative max-w-sm w-full text-text">
      <div
        className={`  bg-transparent  flex gap-4 justify-between  items-center  ${isOpen ?"border-2 p-1.5 rounded border-primary" :"border p-2 border-gray-200 rounded-xl"} placeholder:font-light   text-desc cursor-pointer `}
        onClick={toggleDropdown}
      >

       <span className='font-light text-sm'>
        Columns
        </span>
        <ChevronDown className='text-desc  w-4' />
        {/* You can add an icon here for the dropdown arrow */}
      </div>
      {isOpen && (
        <div className="absolute z-20 overflow-auto h-56 top-full mt-1 w-full bg-white border border-gray-200 rounded-md  shadow-lg">
          {columnFilters?.map((column, i) => (
            <div
              key={column.name}
              className="p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(column)}
            >
              <div  className="flex items-center  gap-4 justify-between">
                <span className=' capitalize'>{column.name}</span>
                {/* Optionally, you can add a checkmark icon for selected item */}
                {column.checked && (
                  <Check className="w-4 stroke-[4px] " />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
