import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { socket } from "../../socket";
import "./Chat.scss"

function Chat() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);


  const [userList, setUserList] = useState([]); // Danh sách người dùng
  const [message, setMessage] = useState(""); // Tin nhắn
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn
  const [conversations, setConversations] = useState([]); // Đoạn chat
  const [receiver, setReceiver] = useState("") //Tên người nhận
  const [selectedUser, setSelectedUser] = useState(null); // Người được chọn
  const [openChatList, setOpenChatList] = useState(true)

  // Lắng nghe tin nhắn realtime
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      console.log("📩 Nhận tin nhắn:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // Lấy danh sách người dùng và đoạn chat
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
        console.error("❌ Lỗi khi fetch:", err);
      }
    };

    fetchData();
  }, [token, currentUser._id]);

  // Khi thay đổi đoạn chat → fetch lại tin nhắn
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

  // Tự join room khi vào đoạn chat
  useEffect(() => {
    const joinRoom = () => {
      if (conversationId) {
        socket.emit("joinRoom", { conversationId });
        console.log("✅ Đã vào phòng:", conversationId);
      }
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
      socket.connect();
    }
  }, [conversationId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gửi tin nhắn
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
        setReceiver(data.fullName);
        convId = data._id;
        navigate(`/chat/${convId}`); // chuyển sang đoạn chat mới
      } catch (err) {
        return alert("Lỗi khi tạo đoạn chat mới");
      }
    }

    if (!convId) return alert("Không tìm thấy đoạn chat hoặc người nhận");

    socket.emit("sendMessage", { conversationId: convId, message });

    setMessage("");
  };

  // Chọn đoạn chat
  const handleClickConversation = (item) => {
    navigate(`/chat/${item._id}`);
    setReceiver(item.fullName);
    setSelectedUser(null); // xoá user đang chọn nếu có
  };
  // Khi click vào user bên phải
  const handleClickUser = (user) => {
    navigate(`/chat`);
    setReceiver(user.fullName);
    setSelectedUser(user); // lưu user được chọn

    const existConversation = conversations.find(conv =>
      conv.members.some(m => m._id === user._id)
    );

    if (existConversation) {
      navigate(`/chat/${existConversation._id}`);
    } else {
      setMessages([])
    }
  };
  return (
    <div className="chat">
      {/* Sidebar trái */}
      <div className={`chat__sidebar-left ${openChatList ? "" : "chat__sidebar-close" }`}>
        <h4 className="chat__heading">Đoạn chat</h4>
        <ul className="chat__conversation-list">
          {conversations.map((item) => (
            <li key={item._id} className={`chat__conversation-item ${conversationId === item._id}`}>
              <div onClick={() => handleClickConversation(item)} className={`chat__conversation-item ${(conversationId === item._id) ? "active" : ""}`}>
                <IconButton>
                  <ChatIcon />
                </IconButton>
                {item.members.find((m) => m._id !== currentUser._id)?.fullName}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Khung tin nhắn */}
      <div className="chat__main">
        {conversationId || selectedUser ? (
          <>
            <div className="chat__title">
              <IconButton onClick={() => setOpenChatList(!openChatList)}>{openChatList ? <CloseIcon /> : <MenuIcon />}</IconButton>
              <h4 className="chat__heading">Tin nhắn từ: {receiver}</h4>
            </div>
            <ul className="chat__messages">
              {messages.map((msg, i) => (
                <li
                  key={i}
                  className={`chat__message ${msg.sender?._id === currentUser._id
                    ? "chat__message--self"
                    : "chat__message--other"
                    }`}
                >
                  <strong>
                    {msg.sender?._id === currentUser._id
                      ? "Bạn"
                      : msg.sender?.fullName || "Người gửi"}
                    :
                  </strong>{" "}
                  {msg.message}
                </li>
              ))}
              <div ref={bottomRef} />
            </ul>
            <div className="chat__input-wrapper">
              <input
                className="chat__input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
              />
              <button className="chat__send-btn" onClick={handleSend}>
                Gửi
              </button>
            </div>
          </>
        ) : (
          <p className="chat__placeholder">Chọn đoạn chat để bắt đầu trò chuyện</p>
        )}
      </div>

      {/* Sidebar phải */}
      <div className="chat__sidebar-right">
        <h4 className="chat__heading">Người dùng</h4>
        <ul className="chat__user-list">
          {userList.map((user) => (
            <li key={user._id} className="chat__user-item">
              <IconButton onClick={() => handleClickUser(user)}>
                <ChatIcon />
              </IconButton>
              {user.fullName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Chat;
