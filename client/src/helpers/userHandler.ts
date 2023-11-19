export const userHandler = {
  getToken() {
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      return token;
    }
    return 0;
  },
  setToken(token: string) {
    localStorage.setItem("access_token", token);
  },
};
