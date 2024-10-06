const { LOADING } = require("@/actions/actionTypes");

var initialState = true;

const loading = (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      state = action.value;
      return { state };
    default:
      return { state };
  }
};

export default loading