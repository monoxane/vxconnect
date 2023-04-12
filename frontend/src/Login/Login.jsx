// General Imports
import React, {
  useState,
  useEffect
} from 'react';

import {
  useNavigate
} from 'react-router-dom'

import {
  Theme,
  Grid,
  Row,
  InlineLoading,
  Form,
  FormLabel,
  TextInput,
  Button,
  Checkbox,
  InlineNotification
} from '@carbon/react'

import {
  ArrowRight
} from '@carbon/icons-react'

import axios from 'axios'

import useAuth from '../hooks/useAuth';

const Login = function Login() {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrMsg] = useState('')
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setErrMsg('');
  }, [user, pass]);

  const handleSubmit = async () => {
    setPersist(true)
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/v1/login',
        JSON.stringify({ username: user, password: pass }),
        {
          headers: { 'Content-Type': 'application/json' },
          // withCredentials: true,
        },
      );
      const accessToken = response?.data?.token;
      
      setAuth({
        user, roles: response?.data?.roles, accessToken,
      });
      setUser('');
      setPass('');

      navigate('/');
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setErrMsg('Connect API did not respond');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Incorrect Username or Password');
      } else {
        setErrMsg('Login Failed');
      }
      setLoading(false);
    }
  };

  return (
    <>
      {/* <LoginShell /> */}
      <Theme theme="g10">
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Log in to vx0 Connect</h1>
          <Form className="login-form">
          {errorMessage && (
              <InlineNotification
                // title="Unable To Login"
                subtitle={errorMessage}
              />
            )}
            <br />
            <FormLabel htmlFor="username" className="username-textabove">Username</FormLabel>
            <TextInput
              id="username"
              className="username-field"
              light
              type="text"
              placeholder="user@vx0.dev"
              labelText={""}
              required
              onChange={(e) => setUser(e.target.value)}
            />
            <FormLabel htmlFor="password" className="password-textabove">Password</FormLabel>
            <TextInput
              id="password"
              className="password-field"
              light
              type="password"
              required
              placeholder="Enter your password"
              labelText={""}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button className="continue-button" kind="primary" tabIndex={0} onClick={handleSubmit}>
              <div>Continue</div>
              <div className="continue-arrowright">
                {loading ? <InlineLoading/> : <ArrowRight />}
              </div>
            </Button>
          </Form>
        </div>
      </div>
      </Theme>
    </>
  );
}

export default Login