import { get, post } from "../utils/request";

export const getAllMsg = async (conversationId) => {
  const result = await get(`messages/${conversationId}`);
  return result;
}

export const createConv = async (option) => {
  const result = await post(`conversations`, option);
  return result;
}

export const getAllConversations = async () => {
  const result = await get(`conversations`);
  return result;
}