import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { register } from "../../Services/UserServices";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
function Register() {
  const [dataRegister, setdataRegister] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    const data = await register(dataRegister);
    console.log(data);
    if (data.user) {
      alert(data.message);
      setError("");
      setIsLoading(false);
      window.location.href = "/login";
    } else {
      alert(data.message);
      setIsLoading(false);
      const err = data?.message || "Đăng ký thất bại!";
      setError(err);
    }
  };

  return (
    <>
      <div className='register'>
        <Box className="formResgiter"
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1 } }}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className='backHome'><Link to="/">TaskFlow</Link></div>
          <h1 className='form__title'>Đăng ký</h1>
          {error && (
            <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
              <Alert severity="error">{error}</Alert>
            </Stack>
          )}
          <div className='register__input'>
            <TextField
              label="Tài khoản*"
              type="text"
              variant="outlined"
              sx={{
                width: { sm: '100%', lg: '45%' },
                maxWidth: "450px",
                minWidth: "200px"
              }}
              value={dataRegister.username}
              onChange={(e) =>
                setdataRegister({ ...dataRegister, username: e.target.value })
              }
            />
            <TextField
              label="Mật khẩu*"
              type="password"
              variant="outlined"
              sx={{
                width: { sm: '100%', lg: '45%' },
                maxWidth: "450px",
                minWidth: "200px"
              }}
              value={dataRegister.password}
              onChange={(e) =>
                setdataRegister({ ...dataRegister, password: e.target.value })
              }
            />
            <TextField
              label="Họ và tên*"
              type="text"
              variant="outlined"
              value={dataRegister.fullName}
              sx={{
                width: { sm: '100%', lg: '45%' },
                maxWidth: "450px",
                minWidth: "200px"
              }}
              onChange={(e) =>
                setdataRegister({ ...dataRegister, fullName: e.target.value })
              }
            />
            <TextField
              label="Email*"
              type="email"
              variant="outlined"
              value={dataRegister.email}
              sx={{
                width: { sm: '100%', lg: '45%' },
                maxWidth: "450px",
                minWidth: "200px"
              }}
              onChange={(e) =>
                setdataRegister({ ...dataRegister, email: e.target.value })
              }
            />
            <TextField
              label="Số điện thoại*"
              type="text"
              inputMode="numeric"
              value={dataRegister.phone}
              sx={{
                width: { sm: '100%', lg: '45%' },
                maxWidth: "450px",
                minWidth: "200px"
              }}
              onChange={(e) =>
                setdataRegister({ ...dataRegister, phone: e.target.value })
              }
            />
            <TextField
              label="Nghề nghiệp/Chức vụ*"
              type="text"
              inputMode="numeric"
              value={dataRegister.role}
              sx={{
                width: { sm: '100%', lg: '45%' },
                maxWidth: "450px",
                minWidth: "200px"
              }}
              onChange={(e) =>
                setdataRegister({ ...dataRegister, role: e.target.value })
              }
            />

          </div>
          <div className='form__btn'>
            <a href='/login' className='form__switch'>Đã có tài khoản? Đăng nhập ngay</a>
            <Button
              type="submit"
              variant="contained"
              sx={{ m: 1 }}
              loading={isLoading}
            >
              Đăng ký
            </Button>
          </div>
        </Box>
      </div>
    </>
  )
}

export default Register;