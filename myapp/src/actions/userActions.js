import * as types from './actionTypes';
import Request from '../shared/request';

function fetchUserListSuccess(data) {
  return {
    type: types.FETCH_USERLIST_SUCCESS,
    data
  };
}
function fetchUserCountSuccess(data) {
  return {
    type: types.FETCH_USERCOUNT_SUCCESS,
    data
  };
}
function addUserSuccess(data) {
  console.log(data);
  return {
    type: types.ADD_USER_SUCCESS,
    data
  };
}

function addUserError(data) {
  return {
    type: types.ADD_USER_ERROR,
    data
  }
}

function fetchUserListError(data) {
  return {
    type: types.FETCH_USERLIST_SUCCESS,
    data
  };
}

function deleteUserByIdSuccess(data) {
  return {
    type: types.DELETE_USER_SUCCESS,
    data
  };
}



function fetchUserByIdSuccess(data) {
  return {
    type: types.FETCH_USERBYID_SUCCESS,
    data
  };
}

export function addUser(data) {
  console.log(data);
  return function (dispatch) {
    return Request.post('/user/addUser', data).then(res => {
      if (res.success) {
        dispatch(addUserSuccess(res));
      } else {
        dispatch(addUserError(res));
      }
    }).catch((err) => {
      console.log(err)
    });
  };
}

export function editUser(data) {
  return function (dispatch) {
    return Request.post('/user/updateById', data).then(res => {
      if (res.success) {
        dispatch(addUserSuccess(res));
      } else {
        dispatch(addUserError(res));
      }
    }).catch((err) => {
      console.log(err)
    });
  };
}

export function fetchUserCount(search) {
  return function (dispatch) {
    return Request.get('/user/getAllUserCount?search=' + search).then(res => {
      if (res.success)
        dispatch(fetchUserCountSuccess(res));
    });
  };
}

export function fetchUserList(search, sort, pageno, pagelimit) {
  return function (dispatch) {

    return Request.get('/user/getAllUser?search=' + search + "&sort_field=" + sort.field + "&sort_order=" + sort.order + "&pageno=" + pageno + "&pagelimit=" + pagelimit).then(res => {
      if (res.success)
        dispatch(fetchUserListSuccess(res.data));
    });
  };
}

export function fetchUserById(id) {
  return function (dispatch) {
    return Request.get('/user/findByUserId?id=' + id).then(res => {
      if (res.success)
        dispatch(fetchUserByIdSuccess(res.data));
    });
  };
}

export function deleteUserById(id) {
  return function (dispatch) {
    return Request.post('/user/deleteUserById?id=' + id).then(res => {
      if (res.success)
        dispatch(deleteUserByIdSuccess(res));
    });
  };
}
