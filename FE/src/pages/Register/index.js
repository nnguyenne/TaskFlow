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
    // console.log(data);
    if (data.user) {
      alert(data.message);
      setError("");
      setIsLoading(false);
      window.location.href = "/login";
    } else {
      alert(data.message);
      setIsLoading(false);
      const err = data?.message || "Hmm... Something went wrong while signing up. Try again?";
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
          <h1 className='form__title'>Register</h1>
          {error && (
            <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
              <Alert severity="error">{error}</Alert>
            </Stack>
          )}
          <div className='register__input'>
            <TextField
              label="Username*"
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
              label="Password*"
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
              label="Full Name*"
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
              label="Phone*"
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
              label="Role*"
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
            <a href='/login' className='form__switch'>Already have an account? Log in now.</a>
            <Button
              type="submit"
              variant="contained"
              sx={{ m: 1 }}
              loading={isLoading}
            >
              Submit
            </Button>
          </div>
        </Box>
      </div>
    </>
  )
}

export default Register;