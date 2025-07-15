import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { createTask } from '../../Services/TaskServices';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function CreateMyTask(props) {
  const { onReload, parentTask } = props;
  const [open, setOpen] = useState(false);
  const dataForm = { title: '', description: '', deadline: '', parentTask: parentTask }
  const [taskDataForm, settaskDataForm] = useState({ ...dataForm });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("Tạo task thành công!");
  const [severity, setSeverity] = useState("success"); // success | error | warning | info

  const handleOpen = () => setOpen(true);
  const handleClose = () => { settaskDataForm(dataForm); setOpen(false); }
  const handleSave = () => {
    const fetchApi = async () => {
      const data = await createTask(taskDataForm);
      const newTask = data.task;
      if (newTask) {
        // console.log(data.message);
        setMessage(data.message);
        setSeverity("success");
        setOpenSnackbar(true);
        settaskDataForm(dataForm);
        onReload();
        setOpen(false);
      } else {
        // console.log(data.message);
        setMessage(data.message);
        setSeverity("error");
        setOpenSnackbar(true);
        setOpen(true);
      }
    }; fetchApi();
  };
  return (
    <>
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

      <Button sx={{ m: 3 }} variant="contained" color="primary" onClick={handleOpen}>
        + Add New Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            fullWidth
            margin="dense"
            value={taskDataForm.title}
            onChange={(e) => settaskDataForm({ ...taskDataForm, title: e.target.value })}
          />
          <TextField
            label="Task Description"
            fullWidth
            margin="dense"
            multiline
            minRows={4}
            maxRows={8}
            value={taskDataForm.description}
            onChange={(e) => settaskDataForm({ ...taskDataForm, description: e.target.value })}
          />
          <TextField
            label="Deadline"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={taskDataForm.deadline}
            onChange={(e) => settaskDataForm({ ...taskDataForm, deadline: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateMyTask;