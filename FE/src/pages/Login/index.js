import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { login } from "../../Services/UserServices";
import { Link } from 'react-router-dom';
import "./login.scss";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    // console.log(dataLogin);
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const data = await login(dataLogin);

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } else {
      setError("Oops! That login info doesn’t seem right. Try again?");
      setIsLoading(false);
    }
  };

  return (
    <div className='login'>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className='backHome'><Link to="/">TaskFlow</Link></div>
        <h1 className='form__title'>Login</h1>
        {error && (
          <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
        <div className='login__input'>
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            value={dataLogin.username}
            onChange={(e) =>
              setDataLogin({ ...dataLogin, username: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={dataLogin.password}
            onChange={(e) =>
              setDataLogin({ ...dataLogin, password: e.target.value })
            }
          />
        </div>
        <div className='form__btn'>
          <a href='/register' className='form__switch'>Don't have an account? Sign up now</a>
          <Button
            type="submit"
            variant="contained"
            sx={{ m: 1 }}
            loading={isLoading}
          >
            Login
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Login;
