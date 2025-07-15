import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import { socket } from "../../socket";
import "./Chat.scss"
import Friends from "./Friends";
import { createConv, getAllMsg } from "../../Services/messageService";
import AllConversations from "./AllConversations";

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
      // console.log("📩 Nhận tin nhắn:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);


  // Khi thay đổi đoạn chat → fetch lại tin nhắn
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      const data = await getAllMsg(conversationId);
      setMessages(data);
    };

    fetchMessages();
  }, [conversationId, token]);

  // Tự join room khi vào đoạn chat
  useEffect(() => {
    const joinRoom = () => {
      if (conversationId) {
        socket.emit("joinRoom", { conversationId });
        // console.log("✅ Đã vào phòng:", conversationId);
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
        const data = await createConv({ receiverId: selectedUser._id })
        setReceiver(data.fullName);
        convId = data._id;
        navigate(`/chat/${convId}`); // chuyển sang đoạn chat mới
        window.location.reload();
      } catch (err) {
        return alert("Lỗi khi tạo đoạn chat mới");
      }
    }

    if (!convId) return alert("Không tìm thấy đoạn chat hoặc người nhận");

    socket.emit("sendMessage", { conversationId: convId, message });

    setMessage("");
  };

  return (
    <div className="chat">
      {/* Sidebar trái */}
      <AllConversations setConversations={setConversations} setReceiver={setReceiver} setSelectedUser={setSelectedUser} openChatList={openChatList} conversations={conversations} currentUser={currentUser} />
      {/* Khung tin nhắn */}
      <div className="chat__main">
        {conversationId || selectedUser ? (
          <>
            <div className="chat__title">
              <IconButton onClick={() => setOpenChatList(!openChatList)}>{openChatList ? <CloseIcon /> : <MenuIcon />}</IconButton>
              <h4 className="chat__heading">Messages from: {receiver}</h4>
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
          <p className="chat__placeholder">Select a conversation to start chatting</p>
        )}
      </div>

      {/* Sidebar phải */}
      <Friends setReceiver={setReceiver} setSelectedUser={setSelectedUser} setMessages={setMessages} conversations={conversations} userList={userList} setUserList={setUserList} />
    </div>
  );
}

export default Chat;
