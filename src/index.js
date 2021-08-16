import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EasyrouteProvider } from 'react-easyroute';
import routes from './Router/router';
import { HashRouter,  } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter routes={routes}>
      <App routes={routes}/>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
