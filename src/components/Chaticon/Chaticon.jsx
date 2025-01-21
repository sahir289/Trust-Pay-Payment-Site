import React, { useState } from "react";
import { RiChatAiFill } from "react-icons/ri";

const ChatIcon = ({isChatOpen, setIsChatOpen}) => {
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div>
      <div
        className="fixed bottom-4 transform transition-transform duration-300 hover:scale-125  right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        onClick={toggleChat}
      >
        <RiChatAiFill className="text-3xl" />
      </div>

      {isChatOpen && (
        <div className="fixed  bottom-20 right-9 w-60 sm:w-70 bg-[#f1f1eb] shadow-lg rounded-lg p-4">
          <h4 className="text-lg text-gray-500  font-semibold mb-3">Chat with us!</h4>
          <input placeholder="Email here" className="my-1 rounded-md p-1" />
          <textarea
            className="w-full h-20 p-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
          ></textarea>
          <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
