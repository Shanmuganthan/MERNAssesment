import * as types from '../actions/actionTypes';

export default function loginReducer(state = {}, action) {
  switch (action.type) {
    case types.LOGIN_FAIL:
      return Object.assign({}, state, { auth : action.data });
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, { auth: action.user });
      case types.LOGIN_SUCCESS_TOKEN:
        return Object.assign({}, state, { token: action.data });
    default:
      return state;
  }
}