import { ReactElement } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

interface LoginForm { 
  email: string, 
  password: string
}


const Login = (): ReactElement => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginForm> ({
    email: '', 
    password: ''
  })

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const {name, value} = e.target
    setFormData(prevData => ({...prevData, [name]: value}))
  }

  const storeToken = (token: string, id: string) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user", id) 
  }

  const handleLogin = () => {
    console.log(formData)

    if (!formData.email || !formData.password) {
      setLoginError('Email and password are required.');
      return;
    }

    fetch("/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        "email": formData.email,
        "password": formData.password
      }),
      mode: "cors"
    }).then(async response => {
      if (!response.ok) {
        const err = await response.json()
        console.log(err.msg)
        throw new Error(err.msg || 'Login failed');
        
      } else {
        return response.json()
      }
    }).then(data => {
      setLoginError(null);
      storeToken(data.token, data.userid)
      navigate("/home")
    }).catch(error => {
      console.log(error)
      setLoginError(error.message || 'Unknown error occurred')
    })
    
  }

  return (
      <Box display="flex" flexDirection="column" alignItems="center">
          <Typography p={3} variant='h3'>Login</Typography>
          <TextField type="email" name="email" value={formData.email} placeholder="E-mail" onChange={handleChange}></TextField>
          <TextField type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange}></TextField>
          <Box p={1}>
            <Button variant='contained' type='submit' onClick={handleLogin}>Login</Button>
          </Box>
          {loginError && <Alert severity="error" >{loginError}</Alert>}
          <Box mt={5} display="flex" flexDirection="column" alignItems="center">
              <Typography>Don't have an account?</Typography>
              <Button variant="outlined" component={Link} to="/register">Register</Button> 
          </Box>
      </Box>
  )
}

export default Login