import React from "react";

const page = () => {
  return (
    <div className="px-4 py-4">
      <h1 className="header-text font-bold mb-4">Terms and Conditions</h1>
      <h2 className="subtitle-text font-bold mb-2">Welcome to Health Hustle Happiness</h2>
      <p className="leading-7">
        If you continue to browse and use this website, you are agreeing to comply with and be bound
        by the following terms and conditions of use, which together with our privacy policy govern
        Health Hustle Happiness relationship with you in relation to this website. If you disagree
        with any part of these terms and conditions, please do not use our website. The term ‘Health
        Hustle Happiness’ or ‘us’ or ‘we’ refers to the owner of the website{" "}
        <span>
          {/* TODO: Change url to healthhustlehappiness.com */}
          <a href="https://melofi.app/" style={{ textDecoration: "underline" }}>
            https://healthhustlehappiness.com
          </a>
        </span>
        . The term ‘you’ refers to the user or viewer of our website. Your use of this website
        constitutes a contract with us.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-4">Terms of Service</h2>
      <p className="leading-7">
        {/* TODO: Change description */}
        We offer a variety of products on our platform customized to meet your personal preference
        such as choosing a Health Hustle Happiness background music loop based on your mood, you may
        customize it with sounds by interacting with original artworks and enjoy our productivity
        suite of tools.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-4">User Representations</h2>
      <p className="mb-2">By using the Site, you represent and warrant that: </p>
      <p className="mb-2">
        (1) all registration information you submit will be true, accurate, current, and complete;
      </p>
      <p className="mb-2">
        (2) you will maintain the accuracy of such information and promptly update such registration
        information as necessary;
      </p>
      <p className="mb-2">
        (3) you will not access the Site through automated or non-human means, whether through a
        bot, script, or otherwise;
      </p>
      <p className="mb-2">
        (4) you will not use the Site for any illegal or unauthorized purpose;{" "}
      </p>
      <p className="mb-2">
        (5) your use of the Site will not violate any applicable law or regulation.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-2">User Registration</h2>
      <p className="leading-7">
        You may be required to register with the Site. You agree to keep your password confidential
        and will be responsible for all use of your account and password. We reserve the right to
        remove, reclaim, or change a username you select if we determine, in our sole discretion,
        that such username is inappropriate, obscene, or otherwise objectionable.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-4">Modification of the Service</h2>
      <p>
        We reserve the right, at any time, to modify, suspend, or discontinue the Service or any
        part thereof with or without notice.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-4">Third-Party Websites</h2>
      <p className="leading-7">
        The Site may contain links to other websites ('Third-Party Websites') as well as articles,
        photographs, text, graphics, pictures, designs, music, sound, video, information,
        applications, software, and other content or items belonging to or originating from third
        parties ('Third-Party Content'). We are not responsible for any Third-Party Websites
        accessed through the Site or any Third-Party Content posted on, available through, or
        installed from the Site.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-4">General Limitation of Liability</h2>
      <p className="leading-7">
        Health Hustle Happiness provides the Site on an “as is” basis and makes no representations
        whatsoever about any other web site which you may access through the Site or which may link
        to this Site. When you access a site outside the Site, please understand that it is
        independent from the Site and that Health Hustle Happiness has no control over the content
        on that web site. In addition, a link to the Site does not mean that Health Hustle Happiness
        endorses or accepts any responsibility for the content, or the use, of such a web site.
      </p>
      <h2 className="subtitle-text font-bold mb-2 mt-4">Indemnification</h2>
      <p className="leading-7">
        You agree to indemnify, defend and hold harmless the Site, its officers, directors,
        employees, agents, licensors, suppliers and any third-party information providers to the
        Service from and against all losses, expenses, damages and costs, including legal costs:
      </p>
      <ol className="list-decimal">
        <div className="ml-8">
          <li className="font-bold">
            <p className="mt-2 leading-7">
              resulting from any violation of these terms and conditions (including negligent or
              wrongful conduct) by you or any other person accessing the Site and its services;
            </p>
          </li>
          <li className="font-bold">
            <p className="mt-2 leading-7">
              howsoever arising as, a result of you downloading files from the Site or that we
              include links to; and,
            </p>
          </li>
          <li className="font-bold">
            <p className="mt-2 leading-7">
              howsoever arising as, a result of any action you take as either a direct or indirect
              result of information, opinions or other materials on the Site, or generated from the
              Site and its services.
            </p>
          </li>
        </div>
      </ol>
      <h2 className="subtitle-text font-bold mb-2 mt-4">Contact Information</h2>
      <p className="mb-2">For any assistance or clarification kindly reach out to us via:</p>
      <p>Email: welcome@melofi.app</p>
    </div>
  );
};

export default page;
