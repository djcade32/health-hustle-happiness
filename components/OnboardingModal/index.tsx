"use client";

import { Button, Form, Modal } from "antd";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import LoginForms from "./LoginForms";
import SignupForms from "./SignupForms";
import { useAppContext } from "@/context/AppContext";
import ForgotPasswordForms from "./ForgotPasswordForms";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const OnboardingModal = ({ isOpen, setIsOpen }: Props) => {
  const {
    createAccount,
    signUserIn,
    createUserWithGoogle,
    signInWithGoogle,
    sendVerificationEmail,
    auth,
  } = useAppContext();
  const [isSignupShowing, setIsSignupShowing] = useState(false);
  const [isForgotPasswordShowing, setIsForgotPasswordShowing] = useState(false);
  const [showVerifyEmailMessage, setShowVerifyEmailMessage] = useState(false);
  const [formError, setFormError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleModalClose = () => {
    setIsOpen(false);
    setIsSignupShowing(false);
    setIsForgotPasswordShowing(false);
    setFormError(null);
    form.resetFields();
  };

  const onSubmit = async (values: any) => {
    console.log("onSubmit eing ran");
    setLoading(true);
    try {
      if (isSignupShowing) {
        createAccount(values.email.trim(), values.password, values.fullName.trim()).then(() => {
          setIsSignupShowing(false);
          setFormError(null);
          setShowVerifyEmailMessage(true);
        });
        return;
      } else {
        const isSignedIn = await signUserIn(values.email.trim(), values.password);
        if (isSignedIn === "User signed in") {
          handleModalClose();
        }
      }
    } catch (error) {
      console.log("caught error: ", error);
      if (error === "User not found") {
        console.log("setting fields");
        setFormError("Incorrect email or password.");
        form.setFields([
          {
            name: "email",
            errors: [""],
          },
          {
            name: "password",
            errors: [""],
          },
        ]);
      } else if (error === "Too many requests") {
        setFormError("Too many log in tries. Try again later.");
      } else if (error === "User is not verified") {
        setShowVerifyEmailMessage(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (showVerifyEmailMessage) return "Verify your email";
    if (isForgotPasswordShowing) return "Forgot password?";
    return !isSignupShowing ? "Welcome back!" : "Create an account";
  };

  const handleFormChange = () => {
    setIsForgotPasswordShowing(false);
    setFormError(null);
    setIsSignupShowing((prev) => !prev);
  };

  const handleGoogleButtonClick = () => {
    if (isSignupShowing) {
      createUserWithGoogle();
    } else {
      signInWithGoogle();
    }
  };

  const getCorrectForm = () => {
    if (isForgotPasswordShowing) {
      return <ForgotPasswordForms setIsForgotPasswordShowing={setIsForgotPasswordShowing} />;
    } else {
      return (
        <Form form={form} autoComplete="off" name="normal_login" onFinish={onSubmit}>
          {!isSignupShowing ? (
            <LoginForms
              onSubmit={onSubmit}
              setIsForgotPasswordShowing={setIsForgotPasswordShowing}
              loading={loading}
            />
          ) : (
            <SignupForms onSubmit={onSubmit} loading={loading} />
          )}
        </Form>
      );
    }
  };

  const handleSendingVerificationEmail = () => {
    if (auth.currentUser && !loading) {
      setLoading(true);
      try {
        sendVerificationEmail(auth.currentUser);
      } catch (error) {
        console.log("Error sending verification email: ", error);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    }
  };

  return (
    <Modal
      title={getTitle()}
      centered
      open={isOpen}
      onCancel={handleModalClose}
      width={500}
      footer={null}
      maskClosable={false}
      className="bg-primary rounded-xl text-white border-gray border-[1px]"
      styles={{ mask: { backgroundColor: "rgb(211, 227, 253, 0.4)" } }}
    >
      {showVerifyEmailMessage ? (
        <div className="text-center py-2 text-white">
          <p>
            Check your email for a link to verify your account. If it doesn’t appear within a few
            minutes, check your spam folder.
          </p>
          <div className="flex justify-between items-center mt-2">
            <p
              className="cursor-pointer underline text-gray hover:text-white hover:no-underline"
              onClick={() => setShowVerifyEmailMessage(false)}
            >
              Back to log in
            </p>
            <Button
              htmlType="submit"
              className="w-[40%] bg-accent hover:opacity-75 transition-opacity duration-300"
              size="large"
              style={{ color: "white", fontWeight: 500, border: "none" }}
              onClick={handleSendingVerificationEmail}
              loading={loading}
            >
              {loading ? "Sending email..." : " Send email again"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {!isForgotPasswordShowing && (
            <>
              <div
                onClick={handleGoogleButtonClick}
                className="border-[1px] border-gray hover:border-white text-white flex justify-center items-center h-[40px] rounded-lg font-medium hover:cursor-pointer mb-2"
              >
                <FcGoogle size={25} className="mr-2" />
                <p>Google</p>
              </div>

              <div className="w-full flex justify-center items-center gap-2 mb-2">
                <div className="bg-gray w-full h-[1px]" />
                <p>or</p>
                <div className="bg-gray w-full h-[1px]" />
              </div>
            </>
          )}
          {formError && <p className="text-red-500 text-center">{formError}</p>}
          {getCorrectForm()}
          <div className="w-full bg-gray h-[1px] " />
          <div className="flex justify-center items-center mt-2">
            <p className="mr-2">
              {!isSignupShowing ? "Don't have an account?" : "Already have an account?"}
            </p>
            <p className="text-gray hover:text-white cursor-pointer" onClick={handleFormChange}>
              {!isSignupShowing ? "Sign up" : "Log in"}
            </p>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OnboardingModal;
