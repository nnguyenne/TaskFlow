import { Fragment, useEffect, useState } from 'react';
import { deleteTask, getTask, updateTask } from '../../Services/TaskServices';
import {
  List,
  ListItem,
  IconButton,
  Collapse,
  ListItemSecondaryAction,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Pagination,
  Box,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from '@mui/icons-material/Warning';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CreateMyTask from './CreateMyTask';
import UpdateMyTask from './UpdateMyTask';

function Tasks() {
  const [reLoad, setReLoad] = useState(Date.now());
  const [openEdit, setOpenEdit] = useState(false);
  const [dataTask, setDataTask] = useState([]); // khởi tạo mảng listTask cha
  const [sort, setSort] = useState('createdAt_desc');
  const [taskUpdate, setTaskUpdate] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Quản lý task đang mở
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info"); // success | error | warning | info
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({});
  const [status, setStatus] = useState('pending');

  const [totalPage, setTotalPage] = useState(10);
  const [page, setPage] = useState(1)
  const [search, setsearch] = useState("")

  //Lấy dữ liệu
  useEffect(() => {
    const fetchApi = async () => {
      const data = await getTask(search, page, 5, sort);
      setDataTask(data.data);
      // console.log(data.data)
      setTotalPage(data.totalPage);
    };
    fetchApi();
  }, [reLoad, openEdit, page, search, sort]);

  //Xóa
  const handleDelete = async (taskId) => {
    const result = await deleteTask(taskId);
    setSeverity(result.task ? "success" : "error");
    setMessage(result.message);
    setOpenSnackbar(true);
    setReLoad(Date.now());
  };

  // Cập nhật Status
  const handleUpdateStatus = async (item) => {
    const result = await updateTask(item._id, { ...item, isCompleted: status })
    setSeverity(result.task ? "success" : "error");
    setMessage(result.message);
    setOpenSnackbar(true);
    setReLoad(Date.now());
    // console.log(taskUpdate)
  };

  //Lấy id task
  const handleToggleExpand = (taskId) => {
    setExpandedId(expandedId === taskId ? null : taskId);
  };

  const handleReload = () => {
    setReLoad(Date.now());
  };
  return (
    <>
      <UpdateMyTask task={taskUpdate} onReload={handleReload} openEdit={openEdit} setOpenEdit={setOpenEdit} />

      {/* Thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-70%, -50%)",
            zIndex: 9999,
          }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Xác nhận xóa */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" /> Delete {taskToDelete.title || ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Delete Confirmation?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => {
            setOpen(false);
            handleDelete(taskToDelete._id)
          }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xác nhận cập nhật status */}
      <Dialog open={openStatus} onClose={() => setOpenStatus(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="info" /> Change the status of {taskToDelete.title || ""} to: {status}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Delete Confirmation?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatus(false)}>Cancel</Button>
          <Button color="error" onClick={() => {
            setOpenStatus(false);
            handleUpdateStatus(taskUpdate)
          }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Body */}
      <h1 style={{ textAlign: 'center' }}>Task List</h1>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 3 }}>
        <TextField
          label="Search Task"
          sx={{ fontSize: '14px' }}
          onChange={(e) => { setsearch(e.target.value); setPage(1) }}
        />
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sort}
            label="Sort by"
            sx={{ fontSize: '14px' }}
            onChange={(e) => { setSort(e.target.value); setPage(1) }}
          >
            <MenuItem value="createdAt_desc">Recently Created</MenuItem>
            <MenuItem value="updatedAt_desc">Recently Updated</MenuItem>
            <MenuItem value="deadline_asc">Upcoming Deadline</MenuItem>
            <MenuItem value="title_asc">Title A-Z</MenuItem>
            <MenuItem value="title_desc">Title Z-A</MenuItem>
          </Select>
        </FormControl >
      </Box>

      <CreateMyTask onReload={handleReload} parentTask={null} />

      <Pagination
        sx={{ display: 'flex', justifyContent: 'center' }}
        count={totalPage}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
      />

      <List sx={{ m: 1 }}>
        {dataTask.map((item) => (
          <Fragment key={item._id}>
            <ListItem key={item._id}
              component="div"
              onClick={() => handleToggleExpand(item._id)}
              // divider
              sx={{ borderTop: '2px solid #ccc', borderBottom: '1px dashed #ccc' }}
              alignItems="flex-start"
            >
              <Box>
                <Typography fontWeight="bold" fontSize={20}>
                  {item.title}
                </Typography>
                <Typography fontSize={16} color="text.secondary">
                  Status: {item.isCompleted}
                </Typography>
                <Typography fontSize={14} color="error">
                  Deadline: {item.deadline.slice(0, 10)}
                </Typography>
              </Box>


              <ListItemSecondaryAction>
                <Select
                  size="small"
                  value={item.isCompleted}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setTaskUpdate(item)
                    setOpenStatus(true);
                  }}

                  sx={{ minWidth: 80, fontSize: 14 }}
                >
                  <MenuItem value="Pending">⏳ Pending</MenuItem>
                  <MenuItem value="In Progress">🔧 In Progress</MenuItem>
                  <MenuItem value="Completed">✅ Completed</MenuItem>
                </Select>

                <IconButton onClick={() => { setTaskUpdate(item); setOpenEdit(true) }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => { setOpen(true); setTaskToDelete(item) }}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            <Collapse in={expandedId === item._id} timeout="auto" unmountOnExit>
              <CreateMyTask onReload={handleReload} parentTask={item._id} />

              <Typography sx={{ p: 1, pl: 3, whiteSpace: 'pre-line', textAlign: 'justify' }} fontWeight={'bold'} color="black">
                {item?.description.trim()}
              </Typography>


              {item?.subtasks.length > 0 && (
                <Box sx={{ ml: 3 }}>
                  {item.subtasks.map((subtask) => (
                    <Box sx={{ pl: 3, display: 'flex', justifyContent: 'space-between', alignItems:'center' }}
                      key={subtask._id}>
                      <Typography
                        sx={{ pl: 0, pr: 0, pb: 1, flex: '1', fontWeight: 600, fontSize: '15px' }}
                      >
                        - {subtask.title}:
                        <Typography component="span"
                          sx={{ pl: 4, pr: 1, pb: 2, flex: '1', whiteSpace: 'pre-line', textAlign: 'justify', fontSize: '14px', display: 'block' }}
                          color="text.secondary"
                        >
                          {subtask?.description.trim()}
                        </Typography>
                        <Typography component="span"
                          sx={{ pl: 4, pr: 1, pb: 2, flex: '1', whiteSpace: 'pre-line', textAlign: 'justify', fontSize: '14px', display: 'block' }}
                          color="text.secondary"
                        >
                          Status: {subtask.isCompleted}
                        </Typography>
                      </Typography>
                      <Box sx={{ display: 'flex', width: '220px', maxHeight:"50px" }}>
                        <Select
                          size="small"
                          value={subtask.isCompleted}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            setTaskUpdate(subtask)
                            setOpenStatus(true);
                          }}

                          sx={{ minWidth: 50, fontSize: 14 }}
                        >
                          <MenuItem value="Pending">⏳ Pending</MenuItem>
                          <MenuItem value="In Progress">🔧 In Progress</MenuItem>
                          <MenuItem value="Completed">✅ Completed</MenuItem>
                        </Select>
                        <IconButton sx={{ width: '40px' }} onClick={() => { setTaskUpdate(subtask); setOpenEdit(true) }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton sx={{ width: '40px' }} color="error" onClick={() => { setOpen(true); setTaskToDelete(subtask) }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

            </Collapse>

          </Fragment>
        ))}
      </List >
    </>
  );
}

export default Tasks;
