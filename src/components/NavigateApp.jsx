import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavigateApp = () => {
  return (
    <div>
      <NavLink to='/'>Home</NavLink>
      <span> || </span>
      <NavLink to='/about'>About</NavLink>
      <span> || </span>
    </div>
  )
}

