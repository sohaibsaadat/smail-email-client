import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React from 'react'
import { useForm } from "react-hook-form"
import FilledInput from '@mui/material/FilledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import api from '../axios/axios';
import { toast } from 'react-toastify';

const SignUp = () => {
     const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const backendUrl = import.meta.env.VITE_BACKEND;

    const [showPassword, setShowPassword] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
        const navigate = useNavigate();



    const outlinedWeightId = React.useId();
      const standardPasswordId = React.useId();
        const outlinedPasswordId = React.useId();


  const handleClickShowPassword = () => setShowPassword((show) => !show);
 const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };


  const signup = async (data) => {
     setLoading(true);
try {
    data.email = `${data.email}@smail.com`;

const response = await api.post("/user/signup",data)

    if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false)
      }
  
} catch (error) {
   toast.error(
        error.response?.data?.message || "Something went wrong!"
      );
 setLoading(false)

      
}




    
  console.log(data)
  navigate("/login")
  } 
  return (
    <div className='flex flex-col w-full h-screen justify-center items-center'>

<img className='w-60' src="/animatedLogo.gif" alt="" />

<div className='w-125 gap-5 flex flex-col items-center  justify-center'>
<h1 className='text-4xl font-semibold  '>Create Your Account</h1>


<form onSubmit={handleSubmit(signup)} className='w-full flex flex-col justify-center gap-4'>
    <div>
 <TextField {...register("firstName", { required: true })} className='w-full' id="outlined-basic" label="First Name" variant="outlined" />
       {errors.firstName && <span className='text-red-700 text-xs'>First Name is required</span>}
    </div>
    <div>
 <TextField {...register("lastName", { required: true })} className='w-full' id="outlined-basic" label="Last Name" variant="outlined" />
       {errors.lastName && <span className='text-red-700 text-xs'>Last Name is required</span>}
    </div>

     <FormControl sx={{  }} variant="outlined">
          <OutlinedInput  {...register("email", { required: {value:true,message:"Email is required"} ,  pattern: { value: /^[a-z0-9]+$/, message: "Only lowercase letters and numbers are allowed"}})} id={`${outlinedWeightId}-input`} endAdornment={<InputAdornment position="end">@smail.com</InputAdornment>} aria-describedby={`${outlinedWeightId}-helper-text`}  inputProps={{  'aria-label': 'weight', }} />
           {errors.email && <span className='text-red-700 text-xs'>{errors.email.message}</span>}  
    </FormControl>
     
  <FormControl  variant="outlined">
          <InputLabel htmlFor={`${outlinedPasswordId}-input`}>Password</InputLabel>
          <OutlinedInput {...register("password", { required: {value:true,message:"Password is required"} , minLength: { value:8, message: "Password should consist of atleast 8 charachters"}})}  id={`${outlinedPasswordId}-input`} type={showPassword ? 'text' : 'password'}  endAdornment={
              
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
                 {errors.password && <span className='text-red-700 text-xs'>{errors.password.message}</span>}

        </FormControl>
  <Button
          type='submit'
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Sign Up
        </Button>
</form>
<div>
    <p>Already have an account? <strong className='cursor-pointer' onClick={()=>navigate("/login")} >Login Here</strong></p>
</div>
</div>

    

      

    </div>
  )
}

export default SignUp
