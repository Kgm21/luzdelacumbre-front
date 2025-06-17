import React from 'react';
import NavigateApp from '../components/navbar/NavigateApp';
import FooterComponent from '../components/footer/FooterComponent';

const RouterApp = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigateApp />
      <main className="flex-fill">{children}</main>
      <FooterComponent />
    </div>
  );
};

export default RouterApp;