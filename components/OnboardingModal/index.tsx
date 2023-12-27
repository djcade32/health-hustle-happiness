"use client";

import { Form, Modal } from "antd";
import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import LoginForms from "./LoginForms";
import SignupForms from "./SignupForms";
import { useAppContext } from "@/context/AppContext";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const OnboardingModal = ({ isOpen, setIsOpen }: Props) => {
  const { createAccount, signUserIn, createUserWithGoogle, signInWithGoogle } = useAppContext();
  const [isSignupShowing, setIsSignupShowing] = useState(false);
  const [form] = Form.useForm();

  const handleModalClose = () => {
    setIsOpen(false);
    setIsSignupShowing(false);
    form.resetFields();
  };

  const onSubmit = (values: any) => {
    if (isSignupShowing) {
      createAccount(values.email.trim(), values.password, values.fullName.trim());
    } else {
      signUserIn(values.email.trim(), values.password);
    }
    form.resetFields();
  };

  const getTitle = () => {
    return !isSignupShowing ? "Welcome back!" : "Create an account";
  };

  const handleFormChange = () => {
    setIsSignupShowing((prev) => !prev);
  };

  const handleGoogleButtonClick = () => {
    if (isSignupShowing) {
      createUserWithGoogle();
    } else {
      signInWithGoogle();
    }
  };

  return (
    <Modal
      title={getTitle()}
      centered
      open={isOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      width={500}
      footer={null}
      maskClosable={false}
    >
      <div
        onClick={handleGoogleButtonClick}
        className="border-[1px] border-[#BFBFBF] hover:border-accent text-primary flex justify-center items-center h-[40px] rounded-lg font-medium hover:cursor-pointer mb-2"
      >
        <FcGoogle size={25} className="mr-2" />
        <p>Google</p>
      </div>
      <div className="w-full flex justify-center items-center gap-2 mb-2">
        <div className="bg-[#BFBFBF] w-full h-[1px]" />
        <p>or</p>
        <div className="bg-[#BFBFBF] w-full h-[1px]" />
      </div>
      <Form form={form} autoComplete="off" name="normal_login" onFinish={onSubmit}>
        {!isSignupShowing ? (
          <LoginForms onSubmit={onSubmit} />
        ) : (
          <SignupForms onSubmit={onSubmit} />
        )}
      </Form>
      <div className="w-full bg-[#BFBFBF] h-[1px] " />
      <div className="flex justify-center items-center mt-2">
        <p className="mr-2">
          {!isSignupShowing ? "Don't have an account?" : "Already have an account?"}
        </p>
        <p className="text-accent hover:text-primary cursor-pointer" onClick={handleFormChange}>
          {!isSignupShowing ? "Sign up" : "Log in"}
        </p>
      </div>
    </Modal>
  );
};

export default OnboardingModal;
