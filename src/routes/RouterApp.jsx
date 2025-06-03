import React from 'react'
import { NavigateApp } from '../components/NavigateApp' 
import { FooterComponent } from '../components/FooterComponent'
import { Route, Routes } from 'react-router-dom'
import { AboutUs, Error404, HomePage } from '../pages'

export const RouterApp = () => {
  return (
    <div>
      <NavigateApp />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='*' element={<Error404 />} />
      </Routes>

      <FooterComponent />
    </div>
  )
}
