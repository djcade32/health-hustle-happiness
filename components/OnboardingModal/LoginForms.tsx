import { Button, Form, Input } from "antd";
import React from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";

interface Props {
  onSubmit: (values: any) => void;
  setIsForgotPasswordShowing: (isForgotPasswordShowing: boolean) => void;
  loading: boolean;
}

const LoginForms = ({ onSubmit, setIsForgotPasswordShowing, loading }: Props) => {
  return (
    <>
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
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<MdLockOutline />}
          onPressEnter={onSubmit}
          styles={{
            input: { backgroundColor: "transparent", color: "#f2f2f2" },
          }}
          className="input-style mt-2"
        />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-between items-center">
          <p
            className=" cursor-pointer underline text-gray hover:text-white hover:no-underline"
            onClick={() => setIsForgotPasswordShowing(true)}
          >
            Forgot password?
          </p>
          <Button
            htmlType="submit"
            className="w-[40%] bg-accent hover:opacity-75 transition-opacity duration-300"
            size="large"
            loading={loading}
            onClick={() => {}}
            style={{ color: "white", fontWeight: 500, border: "none" }}
          >
            Log in
          </Button>
        </div>
      </Form.Item>
    </>
  );
};

export default LoginForms;
