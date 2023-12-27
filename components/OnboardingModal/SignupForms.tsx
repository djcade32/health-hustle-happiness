import { Button, Form, Input } from "antd";
import React from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

interface Props {
  onSubmit: (values: any) => void;
}

const SignupForms = ({ onSubmit }: Props) => {
  return (
    <>
      <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }}></input>
      <Form.Item
        name="fullName"
        rules={[{ required: true, message: "Please input your Full Name!" }]}
      >
        <Input size="large" type="text" prefix={<FaRegUser />} placeholder="Full name" />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
        <Input
          size="large"
          type="email"
          prefix={<MdOutlineEmail />}
          placeholder="Email"
          className="mt-2"
          autoComplete="false"
        />
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
          autoComplete="false"
        />
      </Form.Item>
      <Form.Item>
        <div className="flex flex-col items-center justify-center">
          <Button
            htmlType="submit"
            className="w-[40%] bg-accent hover:opacity-75 transition-opacity duration-300"
            size="large"
            loading={false}
            onClick={() => {}}
            style={{ color: "white", fontWeight: 500, border: "none" }}
          >
            Sign up
          </Button>
          <p className="text-[12px] text-gray mt-2">
            By signing up I accept the{" "}
            <a className="underline text-gray hover:text-primary">Terms of Service</a> and the{" "}
            <a className="underline text-gray hover:text-primary">Privacy Policy</a>.
          </p>
        </div>
      </Form.Item>
    </>
  );
};

export default SignupForms;
