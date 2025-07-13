// src/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // token đã login từ trước

export const socket = io("https://taskflow-jog8.onrender.com", {
  auth: {
    token: token
  }
});
