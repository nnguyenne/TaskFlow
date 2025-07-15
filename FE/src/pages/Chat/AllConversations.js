import { useNavigate, useParams } from "react-router-dom";

import ChatIcon from "@mui/icons-material/Chat";
import { IconButton } from "@mui/material";
import { useEffect } from "react";
import { getAllConversations } from "../../Services/messageService";
function AllConversations(props) {
  const { setConversations, setReceiver, setSelectedUser, openChatList, conversations, currentUser } = props
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { conversationId } = useParams();


  // Lấy danh sách đoạn chat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const convs = await getAllConversations();
        setConversations(convs);
      } catch (err) {
        console.error("❌ Lỗi khi fetch:", err);
      }
    }; fetchData();
  }, [token, currentUser._id, setConversations]);

  // Chọn đoạn chat
  const handleClickConversation = (item) => {
    navigate(`/chat/${item._id}`);
    setReceiver(item.fullName);
    setSelectedUser(null); // xoá user đang chọn nếu có
  };
  return <>
    {/* Sidebar trái */}
    <div className={`chat__sidebar-left ${openChatList ? "" : "chat__sidebar-close"}`}>
      <h4 className="chat__heading">Conversations</h4>
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
  </>
}

export default AllConversations;