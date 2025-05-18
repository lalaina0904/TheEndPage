"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./chat";
import { MessageCircle } from "lucide-react";

export const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton avec icône animé */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-white text-black rounded-full shadow-lg hover:bg-purple-700 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 0 }}
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal slide-in */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-black z-50 shadow-lg flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center flex-row">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  ✕
                </button>
                <div>Your assistant</div>
              </div>

              {/* Contenu du chat */}
              <div className="flex-1 overflow-auto">
                <Chat />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
