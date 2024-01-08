"use client";

import { useAppContext } from "@/context/AppContext";
import { Modal } from "antd";
import React from "react";

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
    </Modal>
  );
};

export default AboutUsModal;
