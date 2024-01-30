"use client";

import { useAppContext } from "@/context/AppContext";
import { Modal } from "antd";
import React from "react";
import { IoClose } from "react-icons/io5";
import { BsInstagram } from "react-icons/bs";
import Link from "next/link";
import { RiTiktokLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";

const AboutUsModal = () => {
  const { showAboutUsModal, setShowAboutUsModal } = useAppContext();

  const handleModalClose = () => {
    setShowAboutUsModal(false);
    document.getElementById("about_us")?.scrollTo(0, 0);
  };
  return (
    <Modal
      title={"About Us"}
      centered
      open={showAboutUsModal}
      onCancel={handleModalClose}
      width={500}
      footer={null}
      className="bg-primary rounded-xl text-white border-gray border-[1px]"
      styles={{ mask: { backgroundColor: "rgb(211, 227, 253, 0.4)" } }}
      closeIcon={<IoClose color="#96A7BF" size={25} />}
    >
      <div id="about_us" className="h-[300px] overflow-auto custom-scrollbar">
        <p className="text-center leading-7">
          Welcome to HealthHustleHappiness, a dedicated space where personal finance, mental health,
          and physical fitness converge to guide you on a journey towards holistic well-being. At
          HealthHustleHappiness, we believe that true wellness extends beyond just physical fitness
          or financial success—it encompasses the intricate balance of mind, body, and financial
          vitality. Our mission is to empower you with insightful articles carefully curated from
          reputable sources, providing a wealth of knowledge to enhance your health, hustle, and
          happiness. We adhere to the principle: "If it doesn't enrich your health, your hustle, or
          contribute to your happiness, it simply isn't meant for you." This ethos underscores our
          commitment to delivering content that is not only informative but also impactful, ensuring
          that every piece contributes to your overall well-being. Whether you are seeking financial
          prosperity, mental resilience, or a path to personal fitness, HealthHustleHappiness is
          your companion on this transformative journey. Join us as we explore the realms of
          balanced living, offering guidance and inspiration to help you thrive in every facet of
          your life. Your well-being is our priority, and we invite you to embark on this harmonious
          adventure with us.
        </p>
      </div>
      <div className="flex justify-center w-full mt-4 gap-2">
        <Link
          href={"https://www.instagram.com/health.hustle.happiness/"}
          target="_blank"
          className="text-white"
        >
          <BsInstagram size={25} />
        </Link>
        <Link href={"https://twitter.com/ThriveWithHHH"} target="_blank" className="text-white">
          <FaXTwitter size={25} />
        </Link>
        <Link
          href={"https://www.tiktok.com/@health.hustle.happiness?lang=en"}
          target="_blank"
          className="text-white"
        >
          <RiTiktokLine size={25} />
        </Link>
      </div>
    </Modal>
  );
};

export default AboutUsModal;
