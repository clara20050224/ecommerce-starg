import React from "react";
import { FaMobileAlt, FaTiktok } from "react-icons/fa";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
} from "react-icons/fa6";

const FooterLinks = [
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];

const Footer = () => {
  return (
    <div id="footer" className="dark:bg-gray-950"> 
    <div className="dark:bg-gray-950">
      <div className="container">
        <div className="grid md:grid-cols-3 pb-20 pt-5">
          {/* company details */}
          <div className="py-8 px-4">
            <a
              href="#"
              className="text-primary font-semibold tracking-widest text-2xl uppercase sm:text-3xl
"
            >
              Stargshop
            </a>
            {
              <p className="text-gray-600 dark:text-white/70  lg:pr-24 pt-3">
                Welcome to STARGSHOP! Find your favorite styles and enjoy an easy, fun, and secure shopping experience.
              </p>
            }
            {
              <p className="text-gray-500 mt-4">
                Made with 💖 by Starg Group
              </p>
            }
            {
              <a
                href=""
                target="_blank"
                className="inline-block bg-primary/90 text-white py-2 px-4 mt-4 text-sm rounded-full"
              >
                Visit our YouTube Channel
              </a>
            }
          </div>

          {/* Footer links */}
          <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
            <div className="py-8 px-4">
              <h1 className="text-xl font-bold sm:text-left mb-3">
                Important Links
              </h1>
              <ul className="space-y-3">
                {FooterLinks.map((data, index) => (
                  <li key={index}>
                    <a
                      href={data.link}
                      className="text-gray-600 dark:text-gray-400 hover:dark:text-white hover:text-black duration-300"
                    >
                      {data.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* second col links */}
            <div className="py-8 px-4">
              <h1 className="text-xl font-bold sm:text-left mb-3">
                Quick Links
              </h1>
              <ul className="space-y-3">
                {FooterLinks.map((data, index) => (
                  <li key={index}>
                    <a
                      href={data.link}
                      className="text-gray-600 dark:text-gray-400 hover:dark:text-white hover:text-black duration-300"
                    >
                      {data.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Address */}
            <div className="py-8 px-4 col-span-2 sm:col-auto">
              <h1 className="text-xl font-bold sm:text-left mb-3">Address</h1>
              <div>
                {
                  <div className="flex items-center gap-3">
                    <FaLocationArrow />
                    <p>Starg Group </p>
                  </div>
                }
                {
                  <div className="flex items-center gap-3 mt-6">
                    <FaMobileAlt />
                    <p>+62-8978564201</p>
                  </div>
                }

                <div className="flex items-center gap-3 mt-6">
                  <a
                    href="https://www.instagram.com/star.gshop?igsh=M2hkYnVjMTNrYWcx&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-3xl hover:text-primary duration-300" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@stargstyle?_t=ZS-90v2ONLTFHb&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTiktok className="text-3xl hover:text-primary duration-200" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Footer;
