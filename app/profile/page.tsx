"use client";

import SidebarTab from "@/components/Sidebar/SidebarTab";
import { useAppContext } from "@/context/AppContext";
import { Button, Drawer, Form, Input } from "antd";
import React, { useMemo, useState } from "react";
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
import { PiCaretLeft } from "react-icons/pi";

const PROVIDER_LIST = [
  { name: "Google", icon: <FcGoogle size={25} /> },
  // { name: "Facebook", icon: <FaFacebookF size={25} color="#3C5998" /> },
];

const Page = () => {
  const {
    signUserOut,
    user,
    auth,
    updateUser,
    setUser,
    addAnotherMethodOfAuthentication,
    unlinkAuthenticationMethod,
    linkEmailAndPassword,
  } = useAppContext();
  const [loadingUpdateAccountInformation, setLoadingUpdateAccountInformation] = useState(false);
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Account");
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [linkEmailPasswordForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [usedMethodsOfAuthentication, setUsedMethodsOfAuthentication] = useState<any[]>([]);
  const [showChangePasswordSection, setShowChangePasswordSection] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useMemo(() => {
    if (!user || !auth) return;
    const usedProviderList: any = [];

    PROVIDER_LIST.forEach((provider) => {
      auth?.currentUser?.providerData.map((userAuthMethod) => {
        if (userAuthMethod.providerId.includes(provider.name.toLowerCase())) {
          usedProviderList.push(provider);
        }
        if (userAuthMethod.providerId.includes("password")) setShowChangePasswordSection(true);
      });
    });
    setUsedMethodsOfAuthentication(usedProviderList);
  }, [user]);

  const handleSignOut = () => {
    signUserOut();
  };

  const updateAccountInformation = async (values: any) => {
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

  const handleAddingAuthenticationMethod = async (provider: { name: string; icon: any }) => {
    const methodAdded = await addAnotherMethodOfAuthentication(provider.name.toLowerCase());
    if (methodAdded.success) {
      messageApi.open({
        type: "success",
        content: methodAdded.message,
      });
      setUsedMethodsOfAuthentication([...usedMethodsOfAuthentication, provider]);
    } else {
      messageApi.open({
        type: "error",
        content: methodAdded.message,
      });
    }
  };

  const handleUnlinkAuthenticationMethod = async (provider: string) => {
    const methodUnlinked = await unlinkAuthenticationMethod(provider.toLowerCase());
    if (methodUnlinked) {
      messageApi.open({
        type: "success",
        content: "Successfully unlinked authentication method",
      });
      setUsedMethodsOfAuthentication(
        usedMethodsOfAuthentication.filter((method) => method.name !== provider)
      );
    } else {
      messageApi.open({
        type: "error",
        content: "Error unlinking authentication method. Please try again later.",
      });
    }
  };

  const handleLinkingEmailAndPassword = async () => {
    const { email, password } = linkEmailPasswordForm.getFieldsValue();
    const { success, message: messageContent } = await linkEmailAndPassword(email, password);
    if (success) {
      messageApi.open({
        type: "success",
        content: messageContent,
      });
      setShowChangePasswordSection(true);
    } else {
      messageApi.open({
        type: "error",
        content: messageContent,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col border-r-[.5px] border-l-[.5px] w-[70%] max-[1025px]:w-[100%] border-gray relative">
        {contextHolder}
        <div className=" border-b-[.5px] border-gray p-2 flex items-center gap-2 ">
          <div className="hover:cursor-pointer hover:bg-primary-light p-1 rounded-lg transition-colors duration-300 min-[769px]:hidden">
            <PiCaretLeft size={25} onClick={() => setIsSidebarOpen(true)} />
          </div>
          <p className="header-text ">Profile</p>
        </div>
        <div className="flex h-full ">
          <Drawer
            closable={false}
            onClose={() => setIsSidebarOpen(false)}
            open={isSidebarOpen}
            placement="left"
            key={"left"}
            width={250}
            styles={{
              body: { backgroundColor: "#021525", borderRight: ".5px solid #96A7BF", padding: 0 },
            }}
            getContainer={false}
          >
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
          </Drawer>
          {/* Sidebar menu */}
          <div className="w-[40%] border-r-[.5px] border-gray max-[768px]:hidden">
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
                    hidden={!user?.email}
                    name="email"
                    rules={[{ required: true, message: "Please input a valid Email!" }]}
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
              {showChangePasswordSection && (
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
              )}
              {/* Link email address and password */}
              {!showChangePasswordSection && (
                <div className="mb-6">
                  <p className="subtitle-text mb-1 text-white">Link Email Address and Password</p>
                  <p className="text-gray mb-4">
                    Add email address and password credentials to your account.
                  </p>
                  <div className="flex flex-col gap-4">
                    <Form
                      name="link_email_password"
                      form={linkEmailPasswordForm}
                      autoComplete="off"
                      onFinish={() => handleLinkingEmailAndPassword()}
                      className="flex flex-col flex-1 gap-2"
                    >
                      <Form.Item
                        name="email"
                        rules={[{ required: true, message: "Please input a valid Email!" }]}
                      >
                        <Input
                          size="large"
                          type="text"
                          prefix={<MdOutlineEmail />}
                          placeholder="Email"
                          styles={{
                            input: {
                              backgroundColor: "transparent",
                              color: "#f2f2f2",
                            },
                          }}
                          className="input-style"
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a password at least 6 characters.",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          type="password"
                          prefix={<MdLockOutline />}
                          placeholder="Password"
                          styles={{
                            input: {
                              backgroundColor: "transparent",
                              color: "#f2f2f2",
                            },
                          }}
                          className="input-style"
                        />
                      </Form.Item>
                      <Form.Item className="flex justify-end">
                        <Button
                          className="bg-accent hover:opacity-75 transition-opacity duration-300 w-[100px]"
                          size="large"
                          // loading={loadingUpdateAccountInformation}
                          onClick={() => linkEmailPasswordForm.submit()}
                          style={{ color: "white", fontWeight: 500, border: "none" }}
                        >
                          Link
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              )}
              {/* Add another method of authentication section */}
              <div className="mb-6">
                <p className="subtitle-text mb-1 text-white">Add Login Account</p>
                <p className="text-gray mb-4">
                  Add another method of authentication to make sure you never lose access to your
                  account.
                </p>
                <div className="flex flex-col gap-4">
                  {PROVIDER_LIST.map(
                    (provider) =>
                      !usedMethodsOfAuthentication.includes(provider) && (
                        <Button
                          key={provider.name}
                          className=" bg-white hover:opacity-75 transition-opacity duration-300 flex gap-2 w-[250px] items-center justify-center"
                          size="large"
                          onClick={() => handleAddingAuthenticationMethod(provider)}
                          style={{ color: "#021525", fontWeight: 500, border: "none" }}
                        >
                          {provider.icon}
                          Connect to {provider.name}
                        </Button>
                      )
                  )}
                </div>
              </div>

              {/* Remove method of authentication section */}
              {usedMethodsOfAuthentication.length > 0 && (
                <div className="mb-6">
                  <p className="subtitle-text mb-1 text-white">Connected Accounts</p>
                  <p className="text-gray mb-4">
                    Remove the connection between Health Hustle Happiness and authorized login
                    providers.
                  </p>
                  <div className="flex flex-col gap-4">
                    {usedMethodsOfAuthentication.map((method) => (
                      <Button
                        key={method.name}
                        className=" bg-transparent transition-all duration-300 hover:bg-red-500 flex gap-2 w-[250px] items-center justify-center"
                        size="large"
                        onClick={() => handleUnlinkAuthenticationMethod(method.name)}
                        style={{ color: "#f2f2f2", fontWeight: 500, border: "1px solid #f2f2f2" }}
                      >
                        {method.icon}
                        Remove {method.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
