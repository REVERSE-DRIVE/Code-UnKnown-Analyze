import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './Components/Redux/Store';
import Login from './Components/Login/Login';
import Layout from './Components/Layout/Layout';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/*' element={<Layout />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)