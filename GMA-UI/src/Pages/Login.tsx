import { useState } from "react"
import { backendURL } from "../Components/constants"
import { useAppDispatch } from "../redux/hooks"
import { setUser } from "../redux/userSlice"
import { TextField } from "@mui/material"
import './Login.css'


const Login = () => {
    const [badCredentials, setBadCredentials] = useState(false);
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const dispatch = useAppDispatch();

    const submitCredentials = async () => {
        const response = await fetch(`${backendURL}/Auth/Login`, {
            method: 'POST',
            body: JSON.stringify({ username: userName, password: password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const userToken = await response.json();
            const userData = { username: userName, token: userToken.token };
            dispatch(setUser(userData));
            return;
        }
        setBadCredentials(true);
    }

    const registerAccount = async () => {
        const response =await fetch(`${backendURL}/Auth/Register`, {
            method: 'POST',
            body: JSON.stringify({ username: userName, password: password, email: email }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            alert('Account created successfully. Please log in.');
        }
        setMode('login');
    }

    const handleLoginClick = () => {
        submitCredentials();
    }

    return (
        <div className="login-container">
            <div className="login-card">
            <h2>Login</h2>
            {badCredentials && <p style={{color: 'red'}}>Incorrect username or password</p>}
            <div className="login-fields">
            <TextField label="Username" fullWidth margin="normal" onChange={(event) => setUserName(event.target.value)} />
            <TextField label="Password" type="password" fullWidth margin="normal" onChange={(event) => setPassword(event.target.value)} />
            {mode === 'register' && (
                <TextField label="Email" type="email" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
            )}
            </div>
            <div className="login-actions">
            {mode === 'register' && 
            <>
            <button onClick={() => setMode('login')}>Back to Login</button>
                <button onClick={() => registerAccount()}>Register</button>
            </>}
            {mode === 'login' && 
            <>
                <button onClick={handleLoginClick}>Login</button>
                <button onClick={() => setMode('register')}>Create Account</button>
            </>}
            </div>
        </div>
        </div>
    )
}

export default Login;