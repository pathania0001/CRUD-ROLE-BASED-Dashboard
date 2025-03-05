import React, { useEffect } from 'react';

const ActiveButtons = ({ buttons, active, setActive }) => {
  useEffect(()=>{
    console.log(buttons);

  },[buttons])
  return (


    <div className='flex gap-3 overflow-auto md:w-[calc(100vw-320px)] w-[calc(100vw-4rem)]'>
      {buttons?.map((button, index) => (
        <button
          className={`${
            active === index ? '!border-primary text-primary' : 'text-gray-600'
          } px-2 py-0.5 border-b-2 mb-1 border-transparent duration-300 hover:border-primary `}
          key={index}
          onClick={() => {
            setActive(index);
            button?.func && button.func()
          }}
        >
          {button.name}
        </button>
      ))}
    </div>
  );
};

export default ActiveButtons;
