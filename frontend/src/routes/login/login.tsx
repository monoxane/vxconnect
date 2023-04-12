import { useState, useEffect } from "react";
// IBM CARBON LOGIN PAGE
import {
  Grid,
  Form,
  FormGroup,
  FormLabel,
  Checkbox,
  Button,
  TextInput,
  Row,
  Column,
} from "carbon-components-react";
import React from "react";
import LoginShell from "../../components/loginuishell";
import { ArrowRight } from "@carbon/icons-react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer";

export default function Login() {
  return (
    <>
      <LoginShell />
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Log in to VXConnect</h1>
          <Form className="login-form">
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextInput
              id="username"
              className="username-field"
              light
              type="text"
              placeholder="user@vx0.dev"
              labelText={""}
            />
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextInput
              id="password"
              className="password-field"
              light
              type="password"
              required
              placeholder="Enter your password"
              labelText={""}
            />
            <div className="required-fields">
              <div className="id-filter">
                <Checkbox
                  id="remember-id"
                  labelText="Remember me for 30 days"
                />
              </div>
              {/* <a href="#" className="forgot-link">Forgot username or password?</a> */}
            </div>
            {/* <div className="alternative-logins">
                        <span className="alternative-login-item">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12.5 8C12.5 10.4853 10.4853 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8C3.5 5.51472 5.51472 3.5 8 3.5C10.4853 3.5 12.5 5.51472 12.5 8Z"
                                    stroke="#0F62FE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 5.5V7.5"
                                    stroke="#0F62FE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 10.5V10.51"
                                    stroke="#0F62FE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <a href="#">Log in with IBMid</a>
                        </span>
                        <span className="alternative-login-item">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 12.5C9.38071 12.5 10.5 11.3807 10.5 10C10.5 8.61929 9.38071 7.5 8 7.5C6.61929 7.5 5.5 8.61929 5.5 10C5.5 11.3807 6.61929 12.5 8 12.5Z"
                                    stroke="#0F62FE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 5.5V7.5"
                                    stroke="#0F62FE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 10.5V10.51"
                                    stroke="#0F62FE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <a href="#">Log in with IBMid</a>
                        </span>
                    </div> */}
            <div className="account-buttons">
              {/* <Button className="create-button" kind="secondary" tabIndex={0}>
                        Create account
                    </Button> */}
              <Button className="continue-button" kind="primary" tabIndex={0}>
                <div>Continue</div>
                <div className="continue-arrowright">
                  <ArrowRight />
                </div>
              </Button>
            </div>

            <div className="need-help">
              <a href="#">Need help?</a>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
