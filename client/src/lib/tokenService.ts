let token: string | null = null;

export const setToken = (newToken: string | null) => {
  token = newToken;
  if (typeof window !== "undefined") {
    if (newToken) {
      localStorage.setItem("access_token", newToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }
};

export const getToken = () => {
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }
  return token;
};
