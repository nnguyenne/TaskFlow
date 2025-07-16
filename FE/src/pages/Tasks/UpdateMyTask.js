import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { updateTask } from '../../Services/TaskServices';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function UpdateMyTask(props) {
  const { task, openEdit, setOpenEdit } = props;
  // console.log(task._id);

  const dataForm = { title: '', description: '', deadline: '' }
  const [taskDataForm, settaskDataForm] = useState({ ...dataForm });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info"); // success | error | warning | info

  useEffect(() => {
    if (task && openEdit) {
      settaskDataForm({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline?.slice(0, 10) || '', // cắt định dạng ngày nếu có time(slice(0,10))
      });
    }
  }, [task, openEdit]);


  const handleClose = () => { settaskDataForm(dataForm); setOpenEdit(false); }

  const handleSave = () => {
    const fetchApi = async () => {
      const data = await updateTask(task._id, taskDataForm);
      const newTask = data.task;
      if (newTask) {
        // console.log(data.message);
        setMessage(data.message);
        setSeverity("success");
        setOpenSnackbar(true);
        settaskDataForm(dataForm)
        setOpenEdit(false);
      } else {
        // console.log(data.message);
        setMessage(data.message);
        setSeverity("error");
        setOpenSnackbar(true);
        setOpenEdit(true);
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



      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
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
          <Button onClick={handleSave}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UpdateMyTask;