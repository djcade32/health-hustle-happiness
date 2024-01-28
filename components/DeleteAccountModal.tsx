import { useAppContext } from "@/context/AppContext";
import { Button, Form, Input, Modal } from "antd";
import { message } from "antd";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountModal = ({ show, setShow }: Props) => {
  const { deleteUserFromDB, user, signUserOut, handleReauthenticate } = useAppContext();
  const [reauthenticatePassword, setReauthenticatePassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleAccountDelete = async () => {
    if (!user) return;
    if (reauthenticatePassword === "") {
      messageApi.open({
        type: "error",
        content: "Please enter password.",
      });
      return;
    }
    const isReauthenticated = await handleReauthenticate(reauthenticatePassword);
    if (!isReauthenticated) {
      messageApi.open({
        type: "error",
        content: "Incorrect password entered.",
      });
      return;
    }
    const isDeleted = await deleteUserFromDB(user);
    if (isDeleted) {
      setTimeout(() => {
        signUserOut();
      }, 2000);
      messageApi.open({
        type: "success",
        content: "Successfully deleted account.",
      });
      console.log("Successfully deleted account.");
    } else {
      messageApi.open({
        type: "error",
        content: "Error deleting account.",
      });
    }
    setShow(false);
  };
  return (
    <Modal
      title={"Confirm Delete Account"}
      centered
      open={show}
      onCancel={() => setShow(false)}
      width={500}
      footer={null}
      className="bg-primary rounded-xl text-white border-gray border-[1px]"
      styles={{ mask: { backgroundColor: "rgb(211, 227, 253, 0.4)" } }}
      closeIcon={<IoClose color="#96A7BF" size={25} />}
    >
      {contextHolder}
      <p>Enter password to proceed with account deletion.</p>
      <Input.Password
        size="large"
        placeholder="Password"
        prefix={<MdLockOutline />}
        styles={{
          input: { backgroundColor: "transparent", color: "#f2f2f2" },
        }}
        className="input-style mt-2"
        onChange={(e) => setReauthenticatePassword(e.target.value)}
      />
      {/* Error message */}
      <div className="mt-4 flex gap-4">
        <Button
          className="bg-red-500 hover:opacity-75 transition-opacity duration-300"
          size="large"
          onClick={() => setShow(false)}
          style={{ color: "white", fontWeight: 500, border: "none" }}
        >
          Cancel
        </Button>
        <Button
          className="bg-accent hover:opacity-75 transition-opacity duration-300"
          size="large"
          onClick={handleAccountDelete}
          style={{ color: "white", fontWeight: 500, border: "none" }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
