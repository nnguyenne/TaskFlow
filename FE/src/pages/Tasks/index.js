import { Fragment, useEffect, useState } from 'react';
import { deleteTask, getTask } from '../../Services/TaskServices';
import {
  List,
  ListItem,
  ListItemText,
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
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CreateMyTask from './CreateMyTask';
import UpdateMyTask from './UpdateMyTask';

function Tasks() {
  const [reLoad, setReLoad] = useState(Date.now());
  const [openEdit, setOpenEdit] = useState(false);
  const [dataTask, setDataTask] = useState([]); // khởi tạo mảng listTask
  const [sort, setSort] = useState('createdAt_desc');
  const [taskUpdate, setTaskUpdate] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Quản lý task đang mở
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info"); // success | error | warning | info
  const [open, setOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({});

  const [totalPage, setTotalPage] = useState(10);
  const [page, setPage] = useState(1)
  const [search, setsearch] = useState("")

  //Lấy dữ liệu
  useEffect(() => {
    const fetchApi = async () => {
      const data = await getTask(search, page, 5, sort);
      setDataTask(data.data);
      setTotalPage(data.totalPage);
    };
    fetchApi();
  }, [reLoad, openEdit, page, search, sort]);

  //Xóa
  const handleDelete = (taskId) => {
    // console.log("Xoá task:", taskId);
    const fetchApi = async () => {
      const result = await deleteTask(taskId);
      // const task = result.task;
      if (!result.task) {
        setOpenSnackbar(true);
        setMessage(result.message);
        setSeverity("error");
      } else {
        setOpenSnackbar(true);
        setMessage(result.message);
        setSeverity("success");
      }
      // console.log(result);
    }; fetchApi();
    setReLoad(Date.now());
  };

  // console.log(sort)

  //Lấy id task
  const handleToggleExpand = (taskId) => {
    setExpandedId(expandedId === taskId ? null : taskId);
  };

  const handleReload = () => {
    setReLoad(Date.now());
  };
  // console.log("Đang mở task: ", expandedId)
  // console.log(search)
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
            top: "20%",
            left: "50%",
            transform: "translate(-80%, -50%)",
            zIndex: 9999,
          }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Xác nhận */}
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

      <CreateMyTask onReload={handleReload} />
      
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
              divider
              alignItems="flex-start"
            >

              <ListItemText
                primary={item.title}
                secondary={`Hạn chót: ${(item.deadline.slice(0, 10))}`}
              />

              <ListItemSecondaryAction>
                <IconButton onClick={() => { setTaskUpdate(item); setOpenEdit(true) }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => { setOpen(true); setTaskToDelete(item) }}>
                  <DeleteIcon />
                </IconButton>
                {/* <IconButton onClick={() => handleToggleExpand(item._id)}>
                  {expandedId === item._id ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton> */}
              </ListItemSecondaryAction>
            </ListItem>

            <Collapse in={expandedId === item._id} timeout="auto" unmountOnExit>
              <Typography sx={{ pl: 4, pr: 2, pb: 2 }} color="text.secondary">
                {item.description}
              </Typography>
            </Collapse>

          </Fragment>
        ))}
      </List>
    </>
  );
}

export default Tasks;
