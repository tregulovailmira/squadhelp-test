import { put } from 'redux-saga/effects';
import { restorePasswordSuccess, restorePasswordError, updatePasswordSuccess, updatePasswordError } from '../actions/actionCreator';
import * as restController from '../api/rest/restController';

export function * restorePasswordSaga (action) {
    try {
        const { data } = yield restController.restorePassword(action.data);
        yield put(restorePasswordSuccess(data));
    } catch (error) {
        yield put(restorePasswordError(error.response));
    }
}

export function * updatePasswordSaga (action) {
    try {
        const { data } = yield restController.updatePassword(action.data);
        yield put(updatePasswordSuccess(data));
    } catch (error) {
        yield put(updatePasswordError(error.response));
    }
}