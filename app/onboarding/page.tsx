"use client";

import Image from "next/image";
import React from "react";
import logo from "@/public/assets/logo.png";
import { Button, Checkbox, Form, Input } from "antd";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

const page = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
  return (
    <div className=" flex flex-col h-screen">
      <header className=" py-3 pl-5 w-full font-thin">
        <div className="flex gap-3 max-w-fit">
          <Image src={logo} width={50} height={50} alt="health hustle happiness logo" />
          <p className="self-center subtitle-text text-[#D3E3FD]">Health Hustle Happiness</p>
        </div>
      </header>

      <div className="flex-1 flex ">
        <div className="w-[50%] flex flex-col justify-center items-center">
          <div className="flex flex-col gap-3 w-[400px] ">
            <p className="header-text mb-2 text-center text-white font-medium">Log in</p>

            <div className="bg-[#fff] text-primary flex justify-center items-center h-[40px] rounded-lg font-medium hover:cursor-pointer hover:bg-white">
              <FcGoogle size={25} className="mr-2" />
              <p>Google</p>
            </div>
            <div className="w-full flex justify-center items-center gap-2">
              <div className="bg-gray w-full h-[1px]" />
              <p>or</p>
              <div className="bg-gray w-full h-[1px]" />
            </div>
            <Form onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please input your Email!" }]}
              >
                <Input size="large" type="email" prefix={<MdOutlineEmail />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your Password!" }]}
              >
                <Input.Password size="large" placeholder="Password" prefix={<MdLockOutline />} />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-between items-center">
                  <a href="" className="underline text-gray hover:text-white">
                    Forgot password
                  </a>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-[40%]"
                    size="large"
                    loading={false}
                    onClick={() => {}}
                    style={{ border: "1px solid #96A7BF", fontWeight: 500 }}
                  >
                    Log in
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="w-full">
          <div>
            <p>Welcome</p>
          </div>
        </div>
      </div>

      {/* <div className="absolute m-auto left-0 right-0 top-0 bottom-0 items-center justify-center flex">
        <div className=" flex flex-col  w-[400px]">
          <div className="flex flex-col items-center gap-2 mb-5">
            <Image src={logo} width={200} height={200} alt="health hustle happiness logo" />
            <p className="self-center header-text text-[#D3E3FD]">Health Hustle Happiness</p>
          </div>
          <div className="flex flex-col gap-3">
            <Input size="large" placeholder="Email" prefix={<MdOutlineEmail />} type="email" />
            <Input.Password size="large" placeholder="Password" prefix={<MdLockOutline />} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default page;
