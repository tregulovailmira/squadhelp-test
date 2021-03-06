import ACTION from '../actions/actionTypes';

const initialState = {
  isFetching: false,
  isModerating: false,
  error: null,
  offers: [],
  haveMore: true,
  isShowOnFull: false,
  imagePath: null
};

export default function (state = initialState, action) {
  const { type } = action;
  switch (type) {
    case ACTION.GET_ALL_OFFERS_ACTION: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }

    case ACTION.GET_ALL_OFFERS_SUCCESS: {
      const { data: { haveMore, data } } = action;
      return {
        ...state,
        isFetching: false,
        error: null,
        offers: [...state.offers, ...data],
        haveMore
      };
    }

    case ACTION.GET_ALL_OFFERS_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        offers: [],
        error
      };
    }

    case ACTION.SET_MODERATION_STATUS_ACTION: {
      return {
        ...state,
        isModerating: true,
        error: null
      };
    }

    case ACTION.SET_MODERATION_STATUS_SUCCESS: {
      const { data: { id, moderationStatus } } = action;
      const { offers } = state;

      const newOffers = offers.map(offer => {
        if (offer.id === id) {
          return {
            ...offer,
            moderationStatus
          };
        }
        return offer;
      });

      return {
        ...state,
        isModerating: false,
        error: null,
        offers: newOffers
      };
    }

    case ACTION.SET_MODERATION_STATUS_ERROR: {
      const { error } = action;
      return {
        ...state,
        isModerating: false,
        error
      };
    }

    case ACTION.CHANGE_SHOW_IMAGE: {
      const { data: { isShowOnFull, imagePath } } = action;
      return {
        ...state,
        isShowOnFull,
        imagePath
      };
    }

    case ACTION.CLEAR_OFFERS_STORE: {
      return initialState;
    }

    default:
      return state;
  }
}
