/*
    CS 4920 Senior Project - Spring 2022
    Charter and Go Project - Flight Risk Assessment Tool
    Instructor: Taeghyun Kang
    Team: LAW.DAT
        Tyler Anderson
        De-Shian Lin
        Jacob Nicholson
        Aaron Westhoff

    Page Description:
    This is the page loaded on the app startup. It's primary purpose is to handle page routing using React Router.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './App.js';
import View from './View.js';
import Navbar from "./components/Navbar.js"
import Detail_App from "./detail_components/Detail_App"

// redirect function
const Redirect = () => {
  // routing between different pages
  // App.js is called as the index page
  // path e.g. 'localhost:3000/view' will redirect to View.js
  return(
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* This is the main path to load on startup */}
        <Route index element={<App />} /> 

        {/* These are other pages to be used for navigation */}
        <Route path="/view" element={<View />} />
        <Route path="/detail" element={<Detail_App />} />
      </Routes> 
    </BrowserRouter>
  );
}

ReactDOM.render(
  <Redirect />,
  document.getElementById('root')
);
  