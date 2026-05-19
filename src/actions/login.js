export const loginUser = (credentials) => {
  return {
    type: "auth/LOGIN_USER",
    payload: credentials,
  };
};
