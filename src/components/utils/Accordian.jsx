import React, { useState, useRef } from 'react';
import { Trash, Edit } from 'lucide-react';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState('0px');
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    setContentHeight(isOpen ? '0px' : `${contentRef.current.scrollHeight}px`);
  };

  const handleDelete = () => {
    // Implement delete functionality here
    console.log('Delete item');
  };

  const handleEdit = () => {
    // Implement edit functionality here
    console.log('Edit item');
  };

  return (
    <div className="relative border border-gray-200 rounded-md mb-4">
      <div
        className="flex shadow  justify-between items-center p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <button
            className="text-gray-500 hover:text-red-500 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Edit size={20} />
          </button>
          <button
            className="text-gray-500 hover:text-red-500 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
      <div
        style={{ maxHeight: `${contentHeight}`, transition: 'max-height 0.3s ease-in-out' }}
        className="absolute  w-full rounded-md shadow-xl shadow-gray-300  bg-gray-100 border-border     z-10 overflow-hidden"
      >
        <div
          ref={contentRef}
          className={` p-4 border-t border-gray-200`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
