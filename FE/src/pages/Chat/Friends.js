import { IconButton } from "@mui/material";
import { useEffect } from "react";
import ChatIcon from "@mui/icons-material/Chat";
// import MenuIcon from '@mui/icons-material/Menu'; 
// import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { getAllUser } from "../../Services/UserServices";

function Friends(props) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { setReceiver, setSelectedUser, setMessages, conversations, userList, setUserList } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      const data = await getAllUser();
      setUserList(data.filter((u) => u._id !== currentUser._id));
    };
    fetchApi();
  }, [currentUser._id, setUserList]);



  // Khi click vào user bên phải
  const handleClickUser = (user) => {
    navigate(`/chat`);
    setReceiver(user.fullName);
    setSelectedUser(user);

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
    <>
      {/* Sidebar phải */}
      <div className="chat__sidebar-right">
        <h4 className="chat__heading">Friend</h4>
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
    </>
  )
}


export default Friends;