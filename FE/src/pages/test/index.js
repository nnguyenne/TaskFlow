import { useState } from 'react';
import {
  IconButton, Menu, MenuItem, Select, ListItemIcon,
} from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function TestAll() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState('pending');
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem disableRipple>
          <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
          <Select
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="pending">⏳ Pending</MenuItem>
            <MenuItem value="in_progress">🔧 In Progress</MenuItem>
            <MenuItem value="completed">✅ Completed</MenuItem>
          </Select>
        </MenuItem>
        <MenuItem onClick={() => console.log("Sửa")}><EditIcon fontSize="small" /> Sửa</MenuItem>
        <MenuItem onClick={() => console.log("Xoá")}><DeleteIcon fontSize="small" /> Xoá</MenuItem>
      </Menu>
    </>
  );
}
export default TestAll;