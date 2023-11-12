const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        currentUser: action.payload,
      };
    }
    case "LOGOUT": {
      window.location.reload();
      return {
        currentUser: null,
      }
    }
    default:
      return state;
  }
};

export default AuthReducer;