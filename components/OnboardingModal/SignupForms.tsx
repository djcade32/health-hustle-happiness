import { Button, Form, Input } from "antd";
import React from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

interface Props {
  onSubmit: (values: any) => void;
  loading: boolean;
}

const SignupForms = ({ onSubmit, loading }: Props) => {
  return (
    <>
      <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }}></input>
      <Form.Item
        name="fullName"
        rules={[
          {
            required: true,
            message: "Please input your Full Name!",
            whitespace: true,
          },
        ]}
      >
        <Input
          size="large"
          type="text"
          prefix={<FaRegUser />}
          placeholder="Full name"
          className="input-style"
          styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your Email!", whitespace: true, type: "email" },
        ]}
      >
        <Input
          size="large"
          type="email"
          prefix={<MdOutlineEmail />}
          placeholder="Email"
          autoComplete="false"
          className="input-style mt-2"
          styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
            min: 6,
            whitespace: true,
          },
        ]}
      >
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<MdLockOutline />}
          onPressEnter={onSubmit}
          autoComplete="false"
          className="input-style mt-2"
          styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
        />
      </Form.Item>
      <Form.Item>
        <div className="flex flex-col items-center justify-center">
          <Button
            htmlType="submit"
            className="w-[40%] bg-accent hover:opacity-75 transition-opacity duration-300"
            size="large"
            loading={loading}
            onClick={() => {}}
            style={{ color: "white", fontWeight: 500, border: "none" }}
          >
            Sign up
          </Button>
          <p className="text-[12px] text-gray mt-2 max-[670px]:w-[70%]">
            By signing up I accept the{" "}
            <a className="underline text-gray hover:text-white">Terms of Service</a> and the{" "}
            <a className="underline text-gray hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      </Form.Item>
    </>
  );
};

export default SignupForms;
