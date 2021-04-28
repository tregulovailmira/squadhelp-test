import ACTION from '../actions/actionTypes'

const initialState = {
    isFetching: false,
    error: null,
    offers: [],
    haveMore: true
}

export default function (state = initialState, action) {
    const { type } = action;
    switch (type) {
        case ACTION.GET_ALL_OFFERS_ACTION:
        case ACTION.SET_MODERATION_STATUS_ACTION: {
            return {
                ...state,
                isFetching: true,
                error: null
            }
        }

        case ACTION.GET_ALL_OFFERS_SUCCESS: {
            const { data: { haveMore, data} } = action;
            return {
                ...state,
                isFetching: false,
                error: null,
                offers: [...state.offers, ...data],
                haveMore
            }
        }

        case ACTION.GET_ALL_OFFERS_ERROR: {
            const { error } = action;
            return {
                ...state,
                isFetching: false,
                offers: [],
                error
            }
        }

        case ACTION.SET_MODERATION_STATUS_SUCCESS: {
            const { data: { data } } = action;
            return {
                ...state,
                isFetching: false,
                error: null,
                offers: [...state.offers, ...data]
            }
        }

        case ACTION.SET_MODERATION_STATUS_ERROR: {
            console.log('action', action);
            const {  error } = action;
            return {
                ...state,
                isFetching: false,
                error
            }
        }

        default: 
            return state
    }
}