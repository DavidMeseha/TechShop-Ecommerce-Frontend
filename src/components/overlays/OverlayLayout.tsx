import clsx from "clsx";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { RiCloseLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { motion, Variants } from "framer-motion";

type Props = {
  className?: string;
  title?: string;
  children: React.ReactNode;
  close: () => void;
  isLoading?: boolean;
};

const bgVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } }
};

const popupVariants: Variants = {
  hidden: { translateY: 40 },
  visible: { translateY: 0, transition: { duration: 0.15 } },
  exit: { translateY: 40, transition: { duration: 0.2 } }
};

export default function OverlayLayout({ children, close, className, title, isLoading }: Props) {
  return (
    <motion.div animate="visible" exit="exit" initial="hidden">
      <motion.div
        className="fixed left-0 top-0 z-50 h-screen w-screen bg-black bg-opacity-50"
        variants={bgVariants}
        onMouseDown={close}
        onTouchStart={close}
      >
        <motion.div className="h-full w-full overflow-auto transition-transform" variants={popupVariants}>
          <div className="flex min-h-screen items-end justify-center pt-40 md:items-center md:py-8">
            <div
              className={twMerge(
                clsx(
                  "w-full rounded-b-none rounded-t-md bg-white p-4 pb-16 md:max-w-[470px] md:rounded-lg md:pb-4",
                  className
                )
              )}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex w-full items-center justify-between">
                <div className="text-xl font-semibold text-gray-700">{title}</div>
                <button className="rounded-full bg-gray-100 p-1.5" onClick={close}>
                  <RiCloseLine size="26" />
                </button>
              </div>
              <div className="relative min-h-80 md:min-h-min">
                {isLoading ? (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#ffffff85]">
                    <BiLoaderCircle className="animate-spin fill-primary" size={35} />
                  </div>
                ) : null}
                {children}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
