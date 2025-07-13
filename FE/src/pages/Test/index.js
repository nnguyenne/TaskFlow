import {
  Box,
  List,
  ListItem,
  Typography,
  InputBase,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../socket";

function CChat() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [receiver, setReceiver] = useState("")


  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // + để lưu người được chọn
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  // + Lắng nghe tin nhắn mới
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // + Lấy danh sách user và conversation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, convsRes] = await Promise.all([
          fetch("http://localhost:3002/users/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3002/conversations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const users = await usersRes.json();
        const convs = await convsRes.json();

        setUserList(users.filter((u) => u._id !== currentUser._id));
        setConversations(convs);
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
      }
    };

    fetchData();
  }, [token, currentUser._id]);

  // + Mỗi khi conversationId đổi thì lấy lại messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      const res = await fetch(`http://localhost:3002/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [conversationId, token]);

  // + Join room theo conversationId hiện tại
  useEffect(() => {
    const joinRoom = () => {
      if (conversationId) {
        socket.emit("joinRoom", { conversationId });
      }
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
      socket.connect();
    }
  }, [conversationId]);

  // + Tự cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // + Gửi tin nhắn, tạo đoạn chat nếu cần
  const handleSend = async () => {
    if (!message.trim()) return;

    let convId = conversationId;

    // Nếu chưa có đoạn chat → tạo mới
    if (!convId && selectedUser) {
      try {
        const res = await fetch("http://localhost:3002/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiverId: selectedUser._id }),
        });

        const data = await res.json();
        convId = data._id;

        navigate(`/test/${convId}`); // chuyển sang đoạn chat mới
        setReceiver(data.fullName);
      } catch (err) {
        return alert("Lỗi khi tạo đoạn chat mới");
      }
    }

    if (!convId) return alert("Không tìm thấy đoạn chat hoặc người nhận");

    // Gửi tin nhắn qua socket
    socket.emit("sendMessage", { conversationId: convId, message });


    // ✅ Reset ô nhập
    setMessage("");
  };


  // + Khi click vào 1 đoạn chat
  const handleClickConversation = (item) => {
    navigate(`/test`);
    setReceiver(item.fullName);
    setSelectedUser(null); // + xoá user đang chọn nếu có
  };

  // + Khi click vào user bên phải
  const handleClickUser = (user) => {
    setSelectedUser(user); // + lưu user được chọn
    setReceiver(user.fullName);
    const existConversation = conversations.find(conv =>
      conv.members.some(m => m._id === user._id)
    );

    if (existConversation) {
      navigate(`/test/${existConversation._id}`);
    }
  };

  return (
    <Box display="flex" height="90vh">
      {/* Sidebar đoạn chat */}
      <Box width="25%" borderRight="1px solid #ccc" p={2}>
        <Typography variant="h6">Đoạn chat</Typography>
        <List>
          {conversations.map((item) => {
            const isActive = conversationId === item._id;

            return (
              <ListItem
                key={item._id}
                disablePadding
                className={isActive ? "active" : ""}
                onClick={() => handleClickConversation(item)}
                sx={{
                  cursor: "pointer",
                  bgcolor: isActive ? "#e3f2fd" : "transparent",
                  "&:hover": { bgcolor: "#f1f1f1" },
                  px: 1,
                  py: 1,
                }}
              >
                <ChatIcon sx={{ mr: 1 }} />
                <Typography>
                  {item.members.find((m) => m._id !== currentUser._id)?.fullName}
                </Typography>
              </ListItem>
            );
          })}
        </List>

      </Box>

      {/* Khung chat */}
      <Box width="50%" position="relative" p={2} display="flex" flexDirection="column">
        {(conversationId || selectedUser) ? (
          <>
            <Typography variant="h6">Tin nhắn: {receiver}</Typography>
            <List sx={{ flex: 1, overflowY: "auto", py: 1 }}>
              {messages.map((msg, i) => (
                <ListItem
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender?._id === currentUser._id
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor:
                        msg.sender?._id === currentUser._id
                          ? "#e0f7fa"
                          : "#fce4ec",
                      display: "inline-block",
                      maxWidth: "70%",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {msg.sender?._id === currentUser._id
                        ? "Bạn"
                        : msg.sender?.fullName || "Người gửi"}
                    </Typography>
                    <Typography variant="body1">{msg.message}</Typography>
                  </Paper>
                </ListItem>
              ))}
              <div ref={bottomRef} />
            </List>

            <Box
              display="flex"
              gap={1}
              mt={1}
              alignItems="center"
              position="relative"
            >
              <InputBase
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Button variant="contained" onClick={handleSend}>
                <SendIcon />
              </Button>
            </Box>
          </>
        ) : (
          <Typography>Chọn đoạn chat hoặc người dùng để bắt đầu</Typography>
        )}
      </Box>

      {/* Sidebar người dùng */}
      <Box width="25%" borderLeft="1px solid #ccc" p={2}>
        <Typography variant="h6">Người dùng</Typography>
        <List>
          {userList.map((user) => (
            <ListItem key={user._id} disablePadding>
              <IconButton onClick={() => handleClickUser(user)}>
                <ChatIcon />
              </IconButton>
              <Typography>{user.fullName}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default CChat;