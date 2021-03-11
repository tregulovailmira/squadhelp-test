import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import combineReducers from '../reducers/index';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootSaga from '../sagas/rootSaga';


const sagaMiddleware=createSagaMiddleware();

export default function configureStore(){
    const store=createStore(combineReducers,composeWithDevTools(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSaga,store.dispatch);
    return store;
};



