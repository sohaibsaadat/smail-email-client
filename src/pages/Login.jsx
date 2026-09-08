import { Button, Checkbox, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import React from 'react';
import { useForm } from "react-hook-form";
import FilledInput from '@mui/material/FilledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../axios/axios';

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    
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

    // ✅ LOGIN FUNCTION - UPDATED
    const login = async (data) => {
        setLoading(true);

        try {
            // ✅ Prepare login data
            // If your database stores full email (user@smail.com)
            const loginData = {
                ...data,
                email: `${data.email}@smail.com`
            };


            const response = await api.post("/user/login", loginData);

            if (response.data.success) {
                // ✅ Show success message
                toast.success(response.data.message);

                // ✅ Save token to localStorage
                localStorage.setItem("token", response.data.token);
                
                // ✅ Save user data to localStorage
                // Your backend returns userData
                if (response.data.userData) {
                    localStorage.setItem("user", JSON.stringify(response.data.userData));
                } else if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }

                // ✅ Verify data was saved
                console.log("🔍 Verification:", {
                    token: localStorage.getItem("token"),
                    user: localStorage.getItem("user")
                });

                // ✅ Redirect to inbox
                navigate("/inbox");
                
                // ✅ Force reload to initialize socket connection
                // This ensures SocketProvider initializes with the user data
                setTimeout(() => {
                    window.location.reload();
                }, 100);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error("❌ Login error:", error);
            
            // ✅ Handle different error scenarios
            if (error.response) {
                // Server responded with error
                toast.error(
                    error.response.data?.message || 
                    "Login failed. Please check your credentials."
                );
            } else if (error.request) {
                // Request was made but no response
                toast.error("Server is not responding. Please try again later.");
            } else {
                // Something else happened
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col w-full h-screen justify-center items-center'>
            <img className='w-60' src="/animatedLogo.gif" alt="Logo" />

            <div className='w-125 gap-5 flex flex-col items-center justify-center'>
                <h1 className='text-4xl font-semibold'>Log In Your Account</h1>

                <form onSubmit={handleSubmit(login)} className='w-full flex flex-col justify-center gap-4'>
                    
                    {/* Email Input */}
                    <FormControl variant="outlined">
                        <OutlinedInput 
                            {...register("email", { 
                                required: {
                                    value: true,
                                    message: "Email is required"
                                }, 
                                pattern: { 
                                    value: /^[a-z0-9]+$/,
                                    message: "Only lowercase letters and numbers are allowed"
                                }
                            })} 
                            id={`${outlinedWeightId}-input`} 
                            endAdornment={<InputAdornment position="end">@smail.com</InputAdornment>} 
                            aria-describedby={`${outlinedWeightId}-helper-text`}  
                            inputProps={{ 'aria-label': 'weight' }}
                            placeholder="Enter your username"
                        />
                        {errors.email && (
                            <span className='text-red-700 text-xs mt-1'>{errors.email.message}</span>
                        )}
                    </FormControl>

                    {/* Password Input */}
                    <FormControl variant="outlined">
                        <InputLabel htmlFor={`${outlinedPasswordId}-input`}>Password</InputLabel>
                        <OutlinedInput 
                            {...register("password", { 
                                required: {
                                    value: true,
                                    message: "Password is required"
                                }, 
                                minLength: {
                                    value: 8,
                                    message: "Password should consist of at least 8 characters"
                                }
                            })}  
                            id={`${outlinedPasswordId}-input`} 
                            type={showPassword ? 'text' : 'password'}  
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
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
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <span className='text-red-700 text-xs mt-1'>{errors.password.message}</span>
                        )}
                    </FormControl>

                    {/* Login Button */}
                    <Button
                        type='submit'
                        endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            }
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                {/* Sign Up Link */}
                <div>
                    <p>
                        Don't have an account? 
                        <strong 
                            className='cursor-pointer ml-1 text-blue-600 hover:text-blue-800' 
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up Here
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;