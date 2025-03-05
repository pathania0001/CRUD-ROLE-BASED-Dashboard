import React from 'react'

const Persona = ({path}) => {
  return (
     <img className="h-10 w-10 rounded-full object-cover" src={path || "/Images/persona.avif"} alt="" />
               
  )
}

export default Persona