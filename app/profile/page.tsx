"use client";

import SidebarTab from "@/components/Sidebar/SidebarTab";
import { useAppContext } from "@/context/AppContext";
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { MdLockOutline, MdLogout, MdOutlineEmail } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import {
  signInWithEmailAndPassword,
  updateEmail,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { message } from "antd";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Page = () => {
  const { signUserOut, user, auth, updateUser, setUser, addAnotherMethodOfAuthentication } =
    useAppContext();
  const [loadingUpdateAccountInformation, setLoadingUpdateAccountInformation] = useState(false);
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Account");
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleSignOut = () => {
    signUserOut();
  };

  const updateAccountInformation = async (values: any) => {
    // TODO: Allow users to add another method of authentication Google, Facebook, etc.
    if (!isEditMode) return setIsEditMode(true);
    const { fullname, email } = values;
    // If user didn't change anything, don't update
    if (fullname === user?.fullName && email === user?.email) return setIsEditMode(false);
    if (!isValidEmail(email)) {
      form.setFields([
        {
          name: "email",
          errors: ["Please input a valid Email"],
        },
      ]);
      return;
    }
    setLoadingUpdateAccountInformation(true);
    let formError: string | null = null;
    try {
      //TODO: Add validation for email and fullname
      if (!auth || !user) return;
      await updateEmail(auth.currentUser!, email);
      await updateProfile(auth.currentUser!, { displayName: fullname });
      updateUser({ ...user, fullName: fullname, email: email });
      setUser({ ...user, fullName: fullname, email: email });
      console.log("Successfully updated account information");
    } catch (error: any) {
      console.log("Error saving account information: ", error);
      formError = error;
      form.setFields([
        {
          name: "email",
          value: user?.email,
        },
        {
          name: "fullname",
          value: user?.fullName,
        },
      ]);
    } finally {
      setTimeout(() => {
        setLoadingUpdateAccountInformation(false);
        setIsEditMode(false);
        messageApi.open({
          type: formError ? "error" : "success",
          content: formError
            ? "Trouble saving account information. Try again later"
            : "Successfully updated account information",
        });
      }, 2000);
    }
  };

  const updateUserPassword = async (values: any) => {
    if (!auth || !user) return;
    if (!isValidPassword(values.new_password)) {
      changePasswordForm.setFields([
        {
          name: "new_password",
          errors: ["Password must be at least 6 characters"],
        },
      ]);
      return;
    }
    try {
      setLoadingUpdatePassword(true);
      // TODO: Come back and use reauthenticateWithCredential instead of signInWithEmailAndPassword
      await signInWithEmailAndPassword(auth, user.email, values.current_password);
      try {
        await updatePassword(auth.currentUser!, values.new_password);
        setTimeout(() => {
          setLoadingUpdatePassword(false);
          messageApi.open({
            type: "success",
            content: "Successfully updated password",
          });
          changePasswordForm.resetFields();
        }, 2000);
        console.log("Successfully updated password");
      } catch (error: any) {
        console.log("Error saving password.");
        setTimeout(() => {
          setLoadingUpdatePassword(false);
          messageApi.open({
            type: "error",
            content: "Error saving password. Please try again later.",
          });
        }, 2000);
      }
    } catch (error) {
      console.log("Error signing in with current password");
      setTimeout(() => {
        setLoadingUpdatePassword(false);
        changePasswordForm.setFields([
          {
            name: "current_password",
            errors: ["Incorrect password entered. Please try again."],
          },
        ]);
      }, 2000);
    }
  };

  const isValidEmail = (email: string) => {
    let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAddingAuthenticationMethod = async (provider: string) => {
    const methodAdded = await addAnotherMethodOfAuthentication(provider);
    if (methodAdded.success) {
      messageApi.open({
        type: "success",
        content: methodAdded.message,
      });
    } else {
      messageApi.open({
        type: "error",
        content: methodAdded.message,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col border-r-[.5px] border-l-[.5px] w-[70%] border-gray">
        {contextHolder}
        <div className=" border-b-[.5px] border-gray p-2">
          <p className="header-text ">Profile</p>
        </div>
        <div className="flex h-full">
          {/* Sidebar menu */}
          <div className="w-[40%] border-r-[.5px] border-gray ">
            <div>
              <SidebarTab
                icon={<AiOutlineProfile size={20} />}
                onClick={() => setActiveTab("Account")}
                title="Account"
                suffixIcon={<IoIosArrowForward size={20} />}
                isSelected={activeTab === "Account"}
              />
              <SidebarTab
                key={"sign_out"}
                title="Sign out"
                icon={<MdLogout size={20} />}
                onClick={handleSignOut}
                showSelected={false}
              />
            </div>
          </div>
          {/* Content */}
          {/* Had to add excessive padding to bottom of content to prevent delete account section of page from being cut off */}
          <div className="flex flex-1 px-4 py-4 flex-col items-center max-h-[calc(100vh-137px)] h-full overflow-y-scroll custom-scrollbar">
            <div className="flex flex-col flex-1 w-[90%] ">
              {/* Account Information section */}
              <div>
                <p className="subtitle-text mb-2 text-white">Account Information</p>
                <Form
                  name="account_information"
                  form={form}
                  autoComplete="off"
                  onFinish={updateAccountInformation}
                  className="flex flex-col flex-1 gap-2"
                  initialValues={{
                    fullname: user?.fullName,
                    email: user?.email,
                  }}
                >
                  <Form.Item
                    name="fullname"
                    rules={[{ required: true, message: "Please input your Full Name!" }]}
                  >
                    <Input
                      size="large"
                      type="text"
                      prefix={<FaRegUser />}
                      placeholder="Full name"
                      styles={{
                        input: {
                          backgroundColor: "transparent",
                          color: isEditMode ? "#f2f2f2" : "#96A7BF",
                        },
                      }}
                      className="input-style"
                      disabled={!isEditMode}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Please input your Email!" }]}
                  >
                    <Input
                      size="large"
                      type="email"
                      prefix={<MdOutlineEmail />}
                      placeholder="Email"
                      styles={{
                        input: {
                          backgroundColor: "transparent",
                          color: isEditMode ? "#f2f2f2" : "#96A7BF",
                        },
                      }}
                      className="input-style"
                      disabled={!isEditMode}
                    />
                  </Form.Item>
                  <Form.Item className="flex justify-end">
                    <Button
                      className={`${
                        isEditMode ? "bg-accent" : "bg-primary-light"
                      } hover:opacity-75 transition-opacity duration-300 w-[100px]`}
                      size="large"
                      loading={loadingUpdateAccountInformation}
                      onClick={() => form.submit()}
                      style={{ color: "white", fontWeight: 500, border: "none" }}
                    >
                      {isEditMode ? "Save" : "Edit"}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              {/* Change Password section */}
              <div>
                <p className="subtitle-text mb-2 text-white">Change Password</p>
                <Form
                  name="change_password"
                  form={changePasswordForm}
                  autoComplete="off"
                  onFinish={updateUserPassword}
                  className="flex flex-col flex-1 gap-2"
                >
                  <Form.Item
                    name="current_password"
                    rules={[{ required: true, message: "Please enter your current password" }]}
                  >
                    <Input.Password
                      size="large"
                      type="password"
                      prefix={<MdLockOutline />}
                      placeholder="Current Password"
                      styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
                      className="input-style "
                    />
                  </Form.Item>
                  <Form.Item
                    name="new_password"
                    rules={[{ required: true, message: "Please enter your new password" }]}
                  >
                    <Input.Password
                      size="large"
                      type="password"
                      prefix={<MdLockOutline />}
                      placeholder="New Password"
                      styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
                      className="input-style "
                    />
                  </Form.Item>
                  <Form.Item
                    name="Confirm Password"
                    dependencies={["new_password"]}
                    rules={[
                      {
                        required: true,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("new_password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match. Please try again.")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      type="password"
                      prefix={<MdLockOutline />}
                      placeholder="Confirm Password"
                      styles={{ input: { backgroundColor: "transparent", color: "#f2f2f2" } }}
                      className="input-style "
                    />
                  </Form.Item>
                  <Form.Item className="flex justify-end">
                    <Button
                      className="bg-accent hover:opacity-75 transition-opacity duration-300"
                      size="large"
                      loading={loadingUpdatePassword}
                      onClick={() => changePasswordForm.submit()}
                      style={{ color: "white", fontWeight: 500, border: "none" }}
                    >
                      Update Password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              {/* Add another method of authentication section */}
              <div className="mb-6">
                <p className="subtitle-text mb-1 text-white">Add Login Account</p>
                <p className="text-gray mb-4">
                  Add another method of authentication to make sure you never lose access to your
                  account.
                </p>
                <div className="flex flex-col gap-4">
                  <Button
                    className=" bg-white hover:opacity-75 transition-opacity duration-300 flex gap-2 w-[250px]"
                    size="large"
                    onClick={() => handleAddingAuthenticationMethod("google")}
                    style={{ color: "#021525", fontWeight: 500, border: "none" }}
                  >
                    <FcGoogle size={25} />
                    Connect to Google
                  </Button>
                  {/* TODO: Add Facebook authentication */}
                  <Button
                    className=" bg-white hover:opacity-75 transition-opacity duration-300 flex gap-2 w-[250px]"
                    size="large"
                    onClick={() => handleAddingAuthenticationMethod("facebook")}
                    style={{ color: "#021525", fontWeight: 500, border: "none" }}
                  >
                    <FaFacebookF size={25} color="#3C5998" />
                    Connect to Facebook
                  </Button>
                </div>
              </div>
            </div>
            {/* Delete Account section */}
            <div className="border-[1px] border-red-500 rounded-lg p-4 relative w-[90%]">
              <div>
                <div className="text-[#D3E3FD] mb-4">
                  <p className="mb-4">Deleting your account will:</p>
                  <ol className="list-decimal">
                    <div className="ml-4">
                      <li>
                        Permanently delete your profile, along with your authentication
                        associations.
                      </li>
                      <li>Permanently delete all your content, bookmarks, likes, etc.</li>
                    </div>
                  </ol>
                </div>
                <Button
                  className=" bg-red-500 hover:opacity-75 transition-opacity duration-300"
                  size="large"
                  onClick={() => setShowDeleteAccountModal(true)}
                  style={{ color: "#021525", fontWeight: 500, border: "none" }}
                >
                  Delete Account
                </Button>
              </div>
              <div className="absolute top-0 right-0 left-0 bottom-0 bg-red-400 opacity-10 z-[-1]" />
              <DeleteAccountModal
                show={showDeleteAccountModal}
                setShow={setShowDeleteAccountModal}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
