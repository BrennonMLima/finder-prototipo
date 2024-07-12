import api from "./api";

export const login = async (email: string, password: string) => {
  return await api.post("/login", { email, password })
};

export const getAllUsers = async () => {
  return await api.get("/user")
};

export const getUserById = async (userId: string) =>{
    return await api.get(`/user/${userId}`);
};

export const getUserByEmail= async (userEmail: string) =>{
    return await api.get(`/user/${userEmail}`);
};

export const getUserGroups = async (userId: string) => {
    return await api.get(`/user/${userId}/groups;`)
};

export const createUser = async (email: string, name: string, password: string) => {
  return await api.post("/user", { email, name, password })
};
