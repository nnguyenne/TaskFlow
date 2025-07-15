import { IconButton } from "@mui/material";
import { useEffect } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from "react-router-dom";
import { getAllUser } from "../../Services/UserServices";

function Friends(props) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { setReceiver, setSelectedUser, setMessages, conversations, userList, setUserList, openFriendList, setOpenFriendList } = props;
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
      <div className={`chat__sidebar-right ${openFriendList?"":"chat__sidebar-close"}`}>

        <h3 className="chat__sidebar-right--status" onClick={() => setOpenFriendList(!openFriendList)}>{openFriendList ? <ChevronRightIcon/> : <ChevronLeftIcon/>}</h3>
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