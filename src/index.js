import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import productsReducer from './store/Reducers/products';
import loggedInReducer from './store/Reducers/loggedIn';
import thunk from 'redux-thunk';
import { CookiesProvider } from 'react-cookie';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    prods: productsReducer,
    logged:loggedInReducer  
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
  <CookiesProvider>
    <Provider store= {store}>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
)


ReactDOM.render(
  app,
  document.getElementById('root')
);

