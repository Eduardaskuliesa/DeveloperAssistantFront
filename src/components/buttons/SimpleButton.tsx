import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface SimpleButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
}

const SimpleButton = ({ children, className = "", ...props }: SimpleButtonProps) => {
  return (
    <motion.button
      {...props}
      whileTap={{ scale: 0.96, translateY: 2 }}
      className={`h-9 transition-colors font-semibold text-neutral-400 cursor-pointer flex items-center px-2 rounded-md bg-theme-gray hover:bg-theme-lgray ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default SimpleButton;