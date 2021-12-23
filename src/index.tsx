import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'nprogress/nprogress.css'
import reportWebVitals from './reportWebVitals';
import './mock' //使用proxy，需要人工删除此行
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
