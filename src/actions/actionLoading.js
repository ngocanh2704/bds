import { LOADING } from "./actionTypes";

export const setLoading = (value) => {
  return {
    type: LOADING,
    value,
  };
};

export const actSetLoading = (value) => {
  return (dispatch) => {
    return dispatch(setLoading(value));
  };
};
