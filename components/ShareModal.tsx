"use client";

import { Article } from "@/types";
import { Modal } from "antd";
import React from "react";
import { HiLink } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";
import { SlSocialFacebook, SlSocialLinkedin } from "react-icons/sl";
import { IoLogoReddit } from "react-icons/io";
import { message } from "antd";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
} from "react-share";
import { IoClose } from "react-icons/io5";

interface Props {
  article: Article | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const iconProps = {
  size: 30,
};

const ShareModal = ({ article, isOpen, setIsOpen }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleCopyLinkClick = () => {
    if (!article) return;
    navigator.clipboard.writeText(article.link);
    messageApi.open({ type: "success", content: "Copied link to clipboard" });
  };

  return (
    <Modal
      title={"Share Article"}
      centered
      open={isOpen}
      onCancel={handleModalClose}
      width={400}
      footer={null}
      className="bg-primary rounded-xl text-white border-gray border-[1px]"
      styles={{ mask: { backgroundColor: "rgb(211, 227, 253, 0.4)" } }}
      closeIcon={<IoClose color="#96A7BF" size={25} />}
    >
      <div className="flex gap-5 mt-5 justify-center">
        {contextHolder}
        {/* Copy Link */}
        <div className="flex flex-col gap-1 justify-center items-center max-w-fit shadow-lg">
          <div
            className={`bg-gray p-1 rounded-lg hover:opacity-70 cursor-pointer flex justify-center  max-w-fit`}
            onClick={handleCopyLinkClick}
          >
            <HiLink {...iconProps} />
          </div>
          <p className="small-text text-[#D3E3FD]">Copy link</p>
        </div>
        {/* Twitter */}
        <div className="flex flex-col gap-1 justify-center items-center max-w-fit shadow-lg">
          <div
            className={`bg-[#000000] p-1 rounded-lg hover:opacity-70 cursor-pointer flex justify-center  max-w-fit`}
          >
            <TwitterShareButton
              url={article?.link!}
              title={`${article?.title} \n via @ThriveWithHHH \n ${article?.link}`}
            >
              <FaXTwitter {...iconProps} />
            </TwitterShareButton>
          </div>
          <p className="small-text text-[#D3E3FD]">X</p>
        </div>
        {/* Facebook */}
        <div className="flex flex-col gap-1 justify-center items-center max-w-fit shadow-lg">
          <div
            className={`bg-[#3C5998] p-1 rounded-lg hover:opacity-70 cursor-pointer flex justify-center  max-w-fit`}
          >
            <FacebookShareButton
              url={article?.link!}
              title={`${article?.title} \n via @ThriveWithHHH \n ${article?.link}`}
            >
              <SlSocialFacebook {...iconProps} />
            </FacebookShareButton>
          </div>
          <p className="small-text text-[#D3E3FD]">Facebook</p>
        </div>
        {/* Linkedin */}
        <div className="flex flex-col gap-1 justify-center items-center max-w-fit shadow-lg">
          <div
            className={`bg-[#0077B5] p-1 rounded-lg hover:opacity-70 cursor-pointer flex justify-center  max-w-fit`}
          >
            <LinkedinShareButton
              url={article?.link!}
              title={`${article?.title} \n via Health Hustle Happiness \n ${article?.link}`}
              summary={`${article?.title} \n via Health Hustle Happiness \n ${article?.link}`}
            >
              <SlSocialLinkedin {...iconProps} />
            </LinkedinShareButton>
          </div>
          <p className="small-text text-[#D3E3FD]">Linkedin</p>
        </div>
        {/* Reddit */}
        <div className="flex flex-col gap-1 justify-center items-center max-w-fit shadow-lg">
          <div
            className={`bg-[#FF4500] p-1 rounded-lg hover:opacity-70 cursor-pointer flex justify-center  max-w-fit`}
          >
            <RedditShareButton
              url={article?.link!}
              title={`${article?.title} \n via Health Hustle Happiness`}
            >
              <IoLogoReddit {...iconProps} />
            </RedditShareButton>
          </div>
          <p className="small-text text-[#D3E3FD]">Reddit</p>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
