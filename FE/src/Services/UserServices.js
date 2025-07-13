import { del, get, userLogin, patch, checkLogin, Register } from "../utils/request";

export const getUser = async () => {
  const result = await get("users");
  return result;
}

export const getAllUser = async () => {
  const result = await get("users");
  return result;
}

export const login = async (option) => {
  const result = await userLogin("users/login", option);
  return result;
}

export const check = async (option) => {
  const result = await checkLogin("users/check", option);
  return result;
}

export const register = async (option) => {
  const result = await Register("users/register", option);
  return result;
}

export const editUser = async (id, option) => {
  const result = await patch("users", id, option);
  return result;
}

export const deleteUser = async (id) => {
  const result = await del("users", id);
  return result;
}