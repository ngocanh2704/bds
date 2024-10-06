import { combineReducers } from "redux";
import apartment from "./apartment";
import loading from "./loading";

const allReducer = combineReducers({ apartment });

export default allReducer;
