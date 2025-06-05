import React from 'react'
import { NavigateApp } from '../components/NavigateApp' 
import { FooterComponent } from '../components/FooterComponent'
import { Route, Routes } from 'react-router-dom'
import { AboutUs, Error404, HomePage, LoginPage } from '../pages'

export const RouterApp = () => {
  return (
    <div>
      <NavigateApp />

      <Routes>
        <Route path='/home' element={<HomePage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='*' element={<Error404 />} />
      </Routes>

      <FooterComponent />
    </div>
  )
}
