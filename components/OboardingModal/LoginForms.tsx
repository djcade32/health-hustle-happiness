import { Button, Form, Input } from "antd";
import React from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";

interface Props {
  onSubmit: (values: any) => void;
}

const LoginForms = ({ onSubmit }: Props) => {
  return (
    <>
      <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
        <Input size="large" type="email" prefix={<MdOutlineEmail />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          className="mt-2"
          size="large"
          placeholder="Password"
          prefix={<MdLockOutline />}
          onPressEnter={onSubmit}
        />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-between items-center">
          <a href="" className="underline text-gray hover:text-primary">
            Forgot password?
          </a>
          <Button
            htmlType="submit"
            className="w-[40%] bg-accent hover:opacity-75 transition-opacity duration-300"
            size="large"
            loading={false}
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
