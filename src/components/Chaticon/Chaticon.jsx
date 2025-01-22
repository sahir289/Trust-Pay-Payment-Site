import React, { useRef, useState } from "react";
import { RiChatAiFill } from "react-icons/ri";

const ChatIcon = ({ isChatOpen, setIsChatOpen , openChat, closeChat}) => {
  const toggleChat = (e) => {
    // e.stopPropagation();

    setIsChatOpen(!isChatOpen)
    //  isChatOpen ? closeChat() : openChat(); 
   };
    
    const handleStop =(e)=>{
    isChatOpen ? openChat() : closeChat();
  }

  return (
    <div  >
      <div
        className="fixed bottom-4 transform transition-transform duration-300 hover:scale-125  right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        onClick={toggleChat}
      >
        <RiChatAiFill className="text-3xl" />
      </div>

      {isChatOpen  && (
        <div  className="fixed  bottom-20 right-9 w-60 sm:w-70 bg-[#f1f1eb] shadow-lg rounded-lg p-4" >
        <div onClick={handleStop}>  <h4 className="text-lg text-gray-500 font-semibold mb-3">Chat with us!</h4>
          <label className="text-gray-500 text-sm font-bold">
            Email:
          </label>
          <input  placeholder="Enter your Email here" className="my-1 w-full rounded-md p-1" />
          <label className="text-gray-500 text-sm font-bold">
            Phone Number:
          </label>
          <input placeholder="Enter your Phone No. here" className="my-1 w-full rounded-md p-1" />
          <label className="text-gray-500 text-sm font-bold">
            Message:
          </label>
          <textarea
            className="w-full h-20 p-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
          >
          </textarea>
          <p className="text-red-500 mb-4"><span className="font-bold ">Note:</span> Either an Email or Phone Number is required.</p>
       </div>   <button onClick={()=>setIsChatOpen(false)} className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
