import * as types from '../actions/actionTypes';

export default function userReducer(state = {}, action) {
  switch (action.type) {
    case types.FETCH_USERLIST_SUCCESS:
      return Object.assign({}, state, { userlist: action.data });
    case types.FETCH_USERCOUNT_SUCCESS:
      return Object.assign({}, state, { usercount: action.data.data });
    case types.ADD_USER_SUCCESS:
      return Object.assign({}, state, { user: action.data });
    case types.ADD_USER_ERROR:
      return Object.assign({}, state, { user: action.data });
    case types.FETCH_USERBYID_SUCCESS:
      return Object.assign({}, state, { userbyid: action.data });
      case types.DELETE_USER_SUCCESS:
        return Object.assign({}, state, { deleteuser: action.data });
    default:
      return state;
  }
}


export const getUserList = state => state.user;
