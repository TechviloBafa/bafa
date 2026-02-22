import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageLoadTransitionProps {
  children: ReactNode;
  isLoading: boolean;
}

export function PageLoadTransition({ children, isLoading }: PageLoadTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0.6 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={isLoading ? "pointer-events-none" : ""}
    >
      {children}
    </motion.div>
  );
}
