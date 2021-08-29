import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import routes from './Router/router';
import indexReducer from './store/reducers';
import { HashRouter, } from 'react-router-dom';

const store = createStore(indexReducer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter routes={routes}>
        <App routes={routes} />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
