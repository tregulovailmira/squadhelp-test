import ACTION from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    error: null,
    data: null
};

export default function (state = initialState, action) {
    const { type } = action;
    switch (type) {
        case ACTION.RESTORE_PASSWORD_ACTION:
        case ACTION.UPDATE_PASSWORD_ACTION: {
            return {
                ...state,
                isFetching: true,
                error: null
            }
        }

        case ACTION.RESTORE_PASSWORD_SUCCESS: 
        case ACTION.UPDATE_PASSWORD_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isFetching: false,
                error: null,
                data
            }
        }

        case ACTION.RESTORE_PASSWORD_ERROR:
        case ACTION.UPDATE_PASSWORD_ERROR: {
            const { error } = action;
            return {
                ...state,
                isFetching: false,
                error,
            }
        }

        case ACTION.RESET_RESTORE_PASSWORD_STATE: {
            return initialState;
        }

        default: return state;
    }
}