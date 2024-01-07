"use client";

import { useAppContext } from "@/context/AppContext";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";

interface Props {
  setIsForgotPasswordShowing: (isForgotPasswordShowing: boolean) => void;
}

const ForgotPasswordForms = ({ setIsForgotPasswordShowing }: Props) => {
  const { sendPasswordReset } = useAppContext();
  const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);

  const onSubmit = (values: any) => {
    sendPasswordReset(values.email.trim())
      .then(() => {
        setShowCheckEmailMessage(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {showCheckEmailMessage ? (
        <div className="text-center py-2">
          <p>
            Check your email for a link to reset your password. If it doesn’t appear within a few
            minutes, check your spam folder.
          </p>
          <p
            className="cursor-pointer underline text-gray hover:text-primary hover:no-underline mt-2"
            onClick={() => setIsForgotPasswordShowing(false)}
          >
            Back to log in
          </p>
        </div>
      ) : (
        <Form autoComplete="off" name="normal_login" onFinish={onSubmit}>
          <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
            <Input
              size="large"
              type="email"
              prefix={<MdOutlineEmail />}
              placeholder="Email"
              styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
              className="input-style "
            />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-between items-center">
              <p
                className="cursor-pointer underline text-gray hover:text-white hover:no-underline"
                onClick={() => setIsForgotPasswordShowing(false)}
              >
                Back to log in
              </p>
              <Button
                htmlType="submit"
                className="w-[40%] bg-accent hover:opacity-75 transition-opacity duration-300"
                size="large"
                loading={false}
                style={{ color: "white", fontWeight: 500, border: "none" }}
              >
                Send email
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default ForgotPasswordForms;
