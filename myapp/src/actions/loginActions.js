import * as types from './actionTypes';
import Request from '../shared/request';
export function loginSuccess(data) {
  console.log(data)
  return {
    type: types.LOGIN_SUCCESS,
    data
  };
}

export function loginFail(data) {
  console.log(data)
  return {
    type: types.LOGIN_FAIL,
    data
  };
}

export function loginToken(data) {
  console.log(data)
  return {
    type: types.LOGIN_FAIL,
    data
  };
}


export function login(data) {
  return function (dispatch) {
    return Request.post('/user/authenticate', data).then(res => {
      if(res.success){
      dispatch(loginSuccess(res));
      dispatch(loginToken(res.token));
      }else{
        dispatch(loginFail(res));
      }
    });
  };
}

