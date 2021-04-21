import { put } from 'redux-saga/effects';
import { restorePasswordSuccess, restorePasswordError } from '../actions/actionCreator';
import * as restController from '../api/rest/restController';

export function * restorePasswordSaga (action) {
try {
    const { data } = yield restController.restorePassword(action.data);
    yield put(restorePasswordSuccess(data));
} catch (error) {
    yield put(restorePasswordError(error));
}
}