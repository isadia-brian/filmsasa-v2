"use client";
import { useState, useEffect, useRef } from "react";
import { AlignJustify, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import Link from "next/link";
import UserAvatar from "../UserAvatar";
import dynamic from "next/dynamic";
import { User } from "@/types";
import FilmsSearch from "../FilmsSearch";

const ProfileCard = dynamic(() => import("../ProfileCard"));
//import MainSearch from "./MainSearch";
const navLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Movies",
    link: "/movies",
  },
  {
    title: "Series",
    link: "/series",
  },
  {
    title: "Kids",
    link: "/kids",
  },
];

const menuVars = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: [0.12, 0, 0.39, 0],
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
const containerVars = {
  initial: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.09,
      staggerDirection: 1,
    },
  },
};
const NavbarClient = ({ user }: { user: User }) => {
  const [scrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const pathName = usePathname();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100); // Small delay
  };

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 5;

      setIsScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = open ? "hidden" : "auto";
    };

    handleBodyOverflow();

    return () => {
      document.body.style.overflow = "auto"; // Reset body overflow when component unmounts
    };
  }, [open]);

  return (
    <div className="relative">
      <header className="fixed w-full top-0 bg-transparent left-0 z-500">
        <nav
          className="flex justify-between items-center py-4 px-4 z-500"
          role="navigation"
          aria-label="Main Navigation"
        >
          <div className="flex items-center gap-[1ch]">
            <Link
              href="/"
              prefetch={true}
              className={`text-xl font-black text-red-500 transition duration-300 ease-in-out ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              Filmsasa
            </Link>
          </div>
          <div className="hidden lg:flex">
            <ul
              className={`flex px-6 gap-9 items-center transition-colors ${
                scrolled
                  ? " shadow-2xl bg-white/80 text-slate-800 py-[14px] rounded-full "
                  : "py-[14px] bg-black/70 text-slate-50 rounded-full"
              }`}
            >
              {navLinks.map(({ title, link }) => (
                <li
                  className="cursor-pointer text-xs flex flex-col items-center relative"
                  key={title}
                >
                  <Link
                    href={link}
                    prefetch={true}
                    aria-current={pathName === link ? "page" : undefined}
                  >
                    {title}
                  </Link>
                  {pathName === link && (
                    <span
                      className={`h-1 bg-red-500 rounded-full absolute -bottom-[6px] w-1 transition-width duration-300 ease-in-out `}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div
              className={`flex flex-row-reverse md:flex-row items-center gap-3 md:gap-5 transition duration-300 ease-in-out ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              <button
                className="flex lg:hidden bg-white/40 rounded h-8 w-8 items-center justify-center"
                onClick={toggleMenu}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                <AlignJustify className="text-neutral-900 h-6 w-5" />
              </button>

              <div className="flex items-center gap-2 cursor-pointer">
                <FilmsSearch />
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <UserAvatar user={user} />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              variants={menuVars}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed  left-0 top-0 w-full h-screen origin-top bg-neutral-900 text-white py-8 px-4 z-400"
            >
              <div className="flex h-full flex-col z-600">
                <div className="flex justify-between items-center">
                  <Link
                    href="/"
                    className={`text-xl font-black text-red-500 transition duration-300 ease-in-out ${
                      scrolled ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Filmsasa
                  </Link>
                  <button onClick={toggleMenu} aria-label="Close menu">
                    <X />
                  </button>
                </div>
                <motion.div
                  variants={containerVars}
                  initial="initial"
                  animate="open"
                  exit="initial"
                  className="flex flex-col h-full mt-20 gap-7"
                  id="mobile-menu"
                  role="dialog"
                  aria-modal="true"
                >
                  {navLinks.map((link, index) => {
                    return (
                      <div
                        className="overflow-hidden"
                        onClick={toggleMenu}
                        key={index}
                      >
                        <MobileNavLink title={link.title} href={link.link} />
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {isHovered && (
        <div
          className="transition duration-500 ease-linear hidden md:block absolute  right-4 -bottom-16 h-full z-[3000]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ProfileCard user={user} />
        </div>
      )}
    </div>
  );
};

export default NavbarClient;

const mobileLinkVars = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1],
      duration: 0.7,
    },
  },
};
const MobileNavLink = ({ title, href }: { title: string; href: string }) => {
  return (
    <motion.div
      variants={mobileLinkVars}
      className="text-5xl uppercase font-extrabold"
    >
      <Link href={href}>{title}</Link>
    </motion.div>
  );
};
