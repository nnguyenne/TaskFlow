import { del, get, patch, post } from "../utils/request";

export const getTask = async (keyword = "", page = 1, limit = 5, srot="createdAt_desc") => {
  const result = await get(`tasks/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${srot}`);
  return result;
}

export const createTask = async (option) => {
  const result = await post("tasks", option);
  return result;
}

export const updateTask = async (id, option) => {
  const result = await patch("tasks", id, option);
  return result;
}

export const deleteTask = async (id) => {
  const result = await del("tasks", id);
  return result;
}