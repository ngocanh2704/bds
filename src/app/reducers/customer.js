const { FETCH_LOADING, FETCH_CUSTOMER, DELETE_CUSTOMER, ADD_CUSTOMER, EDIT_CUSTOMER, SEARCH_CUSTOMER } = require("@/actions/actionTypes");

var initialState = { data: [] };

const customer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LOADING:
      return { ...state, isLoading: true };
    case FETCH_CUSTOMER:
      state.data = action.data.data;
      return { ...state, isLoading: false, total_page: action.data.total_page };
    case DELETE_CUSTOMER:
      var id = action.id
      state.data = state.data.filter(item => item._id !== id)
      return { ...state, isLoading: false }
    case ADD_CUSTOMER:
      var newData = action.data
      state.data.push(newData)
      return { ...state, isLoading: false }
    case EDIT_CUSTOMER:
      var index = state.data.findIndex(item => item._id == action.data._id)
      state.data[index] = action.data
      return { ...state, isLoading: false }
    case SEARCH_CUSTOMER:
      state.data = action.data.data
      return { ...state, isLoading: false,total_page: action.data.total_page }
    default:
      return { ...state, isLoading: true };
  }
};

export default customer;
