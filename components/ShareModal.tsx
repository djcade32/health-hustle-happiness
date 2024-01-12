"use client";

import { Article } from "@/types";
import { Modal, Tooltip } from "antd";
import React from "react";
import { HiLink } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";
import { SlSocialFacebook, SlSocialLinkedin } from "react-icons/sl";
import { IoLogoReddit } from "react-icons/io";
import { message } from "antd";
import { useAppContext } from "@/context/AppContext";

interface Props {
  article: Article | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const iconProps = {
  size: 30,
};
const shareButtons = [
  { icon: <HiLink {...iconProps} />, text: "Copy link", bgColor: "bg-gray" },
  { icon: <FaXTwitter {...iconProps} />, text: "X", bgColor: "bg-[#000000]" },
  // { icon: <SlSocialFacebook {...iconProps} />, text: "Facebook", bgColor: "bg-[#3C5998]" },
  // { icon: <SlSocialLinkedin {...iconProps} />, text: "Linkedin", bgColor: "bg-[#0077B5]" },
  { icon: <IoLogoReddit {...iconProps} />, text: "Reddit", bgColor: "bg-[#FF4500]" },
];

const ShareModal = ({ article, isOpen, setIsOpen }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleShareButtonClick = (button: string) => {
    // TODO: Implement share funtionality for Facebook and Linkedin
    if (!article) return;
    let textToShare = "";
    switch (button) {
      case "Copy link":
        console.log("copy link");
        navigator.clipboard.writeText(article.link);
        messageApi.open({ type: "success", content: "Copied link to clipboard" });
        break;
      case "X":
        // Twitter Web Intent URL
        textToShare = `${article.title} \n via @hustle_health_happiness \n ${article.link}`;
        const twitterIntentUrl =
          "https://twitter.com/intent/tweet?text=" + encodeURIComponent(textToShare);
        // Open a new window with the Twitter intent URL
        window.open(twitterIntentUrl, "_blank");
        break;
      case "Facebook":
        textToShare = `${article.title} \n via Health Hustle Happiness \n ${article.link}`;
        // Facebook Share Dialog URL
        const facebookShareUrl =
          "https://www.facebook.com/dialog/share?app_id=YOUR_APP_ID&quote=" +
          encodeURIComponent(textToShare);
        // Open a new window with the Facebook Share Dialog URL
        window.open(facebookShareUrl, "_blank");
        break;
      case "Linkedin":
      // textToShare = `${article.title} \n via Health Hustle Happiness \n ${article.link}`;

      // // LinkedIn Share API URL
      // const linkedinShareUrl =
      //   "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(textToShare);

      // // Open a new window with the LinkedIn Share API URL
      // window.open(linkedinShareUrl, "_blank");
      case "Reddit":
        // Reddit Share URL
        const redditShareUrl =
          "https://www.reddit.com/submit?url=" +
          encodeURIComponent(article.link) +
          "&title=" +
          encodeURIComponent(article.title);
        // Open a new window with the Reddit Share URL
        window.open(redditShareUrl, "_blank");
      default:
        break;
    }
  };

  return (
    <Modal
      title={"Share Article"}
      centered
      open={isOpen}
      onCancel={handleModalClose}
      width={300}
      footer={null}
      className="bg-primary rounded-xl text-white border-gray border-[1px]"
      styles={{ mask: { backgroundColor: "rgb(211, 227, 253, 0.4)" } }}
    >
      <div className="flex gap-5 mt-5 justify-center">
        {contextHolder}
        {shareButtons.map((button, index) => (
          <div
            className="flex flex-col gap-1 justify-center items-center max-w-fit shadow-lg"
            key={index}
          >
            <div
              className={`${button.bgColor} p-1 rounded-lg hover:opacity-70 cursor-pointer flex justify-center  max-w-fit`}
              onClick={() => {
                handleShareButtonClick(button.text);
              }}
            >
              {button.icon}
            </div>
            <p className="small-text text-[#D3E3FD]">{button.text}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ShareModal;
