import { ReactElement } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

interface RegistrationForm { 
  firstName: string,
  lastName: string, 
  email: string, 
  password: string
}

// Reference for this https://dev.to/luqmanshaban/creating-a-sign-up-form-in-react-with-typescript-2jb3 
const Registration = (): ReactElement => {
  const [formData, setFormData] = useState<RegistrationForm> ({
    firstName: '', 
    lastName: '',
    email: '', 
    password: ''
  })

  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const {name, value} = e.target
    setFormData(prevData => ({...prevData, [name]: value}))
    
  }

  const handleRegister = () => {
    console.log(formData)

    if (!formData.email || !formData.password) {
      setRegisterError('Email and password are required.');
      return;
    }

    fetch("/users/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        "firstname": formData.firstName,
        "lastname": formData.lastName,
        "email": formData.email,
        "password": formData.password
      }), 
      mode: "cors"
    }).then(async response => {
      if (!response.ok) {
        const err = await response.json()
        throw err
      }

      return response.json()
    }).then( data => {
      navigate("/login")
    }).catch(error => {
      if (error.errors) {
        setRegisterError(error.errors[0].msg) 
      } else {
        console.log(error) // if error is something else than related to insufficient credentials
        if(error.msg) { // if the e-mail was already in use
          setRegisterError(error.msg)
        }
      }
    })
    setRegisterError(null);
  }

  return (
      <Box display="flex" flexDirection="column" alignItems="center">
          <Typography p={3} variant='h3'>Register</Typography>
          <TextField type="text" name="firstName" value={formData.firstName} placeholder="First name" onChange={handleChange}></TextField>
          <TextField type="text" name="lastName" value={formData.lastName} placeholder="last name" onChange={handleChange}></TextField>
          <TextField type="email" name="email" value={formData.email} placeholder="E-mail" onChange={handleChange}></TextField>
          <TextField type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange}></TextField>
          <Box p={1}>
            <Button variant='contained' type='submit' onClick={()=> handleRegister()}>Submit</Button>
          </Box>
          {registerError && <Alert severity="error" >{registerError}</Alert>}
          <Box mt={5} display="flex" flexDirection="column" alignItems="center">
              <Typography>{"Already registered?"}</Typography>
              <Button variant="outlined" component={Link} to="/Login">Login</Button> 
          </Box>
      </Box>
  )
}

export default Registration