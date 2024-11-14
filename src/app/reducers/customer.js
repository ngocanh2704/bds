const { FETCH_LOADING, FETCH_CUSTOMER } = require("@/actions/actionTypes");

var initialState = { data: [] };

const customer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOADING:
      return { ...state, isLoading: true };
    case FETCH_CUSTOMER:
      state.data = action.data.data;
      return { ...state, isLoading: false };
    default:
      return { ...state, isLoading: true };
  }
};

export default customer;
