import { combineReducers } from "redux";
import apartment from "./apartment";
import loading from "./loading";
import customer from './customer'

const allReducer = combineReducers({ apartment, customer });

export default allReducer;
