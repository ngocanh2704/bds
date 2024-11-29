const { FETCH_LOADING, FETCH_CUSTOMER, DELETE_CUSTOMER } = require("@/actions/actionTypes");

var initialState = { data: [] };

const customer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOADING:
      return { ...state, isLoading: true };
    case FETCH_CUSTOMER:
      state.data = action.data.data;
      return { ...state, isLoading: false };
    case DELETE_CUSTOMER:
      var id = action.id
      state.data = state.data.filter(item => item._id !== id)
      return {...state, isLoading: false}
    default:
      return { ...state, isLoading: true };
  }
};

export default customer;
