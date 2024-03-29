import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import rootReducer from '../reducers/rootReducer'

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const middleware = [
    thunk,
    routerMiddleware(history)
];

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

export default function configureStore() {
    return createStore(rootReducer, initialState, composedEnhancers);
}