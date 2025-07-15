// src/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // token đã login từ trước

//Deploy dùng cái này
export const socket = io("https://taskflow-jog8.onrender.com", {
  auth: {
    token: token
  }
});

// //Local dùng cái này
// export const socket = io("http://localhost:3002", {
//   auth: {
//     token: token
//   }
// });
