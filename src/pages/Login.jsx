import { Button, Checkbox, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React from 'react'
import { useForm } from "react-hook-form"
import FilledInput from '@mui/material/FilledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";


const Login = () => {
     const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
    const [showPassword, setShowPassword] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
        const navigate = useNavigate();


    const outlinedWeightId = React.useId();
      const standardPasswordId = React.useId();
        const outlinedPasswordId = React.useId(); 
        const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };



  const handleClickShowPassword = () => setShowPassword((show) => !show);
 const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
 const handleClick = () => {
 
};

  const onSubmit = (data) => {

     setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);
  console.log(data)
  } 
  return (
    <div className='flex flex-col w-full h-screen justify-center items-center'>

<img className='w-60' src="/animatedLogo.gif" alt="" />

<div className='w-125 gap-5 flex flex-col items-center  justify-center'>
<h1 className='text-4xl font-semibold  '>Log In Your Account</h1>


<form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col justify-center gap-4'>
    

     <FormControl sx={{  }} variant="outlined">
          <OutlinedInput  {...register("userName", { required: {value:true,message:"Username is required"} ,  pattern: { value: /^[a-z0-9]+$/, message: "Only lowercase letters and numbers are allowed"}})} id={`${outlinedWeightId}-input`} endAdornment={<InputAdornment position="end">@smail.com</InputAdornment>} aria-describedby={`${outlinedWeightId}-helper-text`}  inputProps={{  'aria-label': 'weight', }} />
           {errors.userName && <span className='text-red-700 text-xs'>{errors.userName.message}</span>}  
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
<div className='flex items-center justify-between'>

<div className='flex items-center'>
          <Checkbox  {...register("rememberMe")} id='rememberMe' {...label} />
<label htmlFor='rememberMe' className='font-semibold cursor-pointer'>Remmeber Me</label>
        </div>

        <p className='font-semibold cursor-pointer'>
          Forget Password?
        </p>
</div>
        
  
  <Button
          type='submit'
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          Login
        </Button>
</form>
<div>
    <p>Don't have an account? <strong className='cursor-pointer' onClick={()=>navigate("/signup")} >Sign Up Here</strong></p>
</div>
</div>

    

      

    </div>
  )
}

export default Login
