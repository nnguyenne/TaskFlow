// src/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // token đã login từ trước

export const socket = io("http://localhost:3002", {
  auth: {
    token: token
  }
});
