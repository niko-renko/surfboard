import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const reducer = (
    state = {},
    update
) => {
    const {
        type,
        ...other
    } = update;

    return {
        ...state,
        ...other
    };
};

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);