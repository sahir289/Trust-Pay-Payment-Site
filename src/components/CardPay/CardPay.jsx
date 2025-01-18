import React, { useEffect, useState } from "react";
import "./CardPay.css";
import creditCardType from 'credit-card-type'; // ES Modules are supported
import { LiaCcVisa } from "react-icons/lia";
import { IoCopy } from "react-icons/io5";
import { RiMastercardLine } from "react-icons/ri";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcDiscover } from "react-icons/fa6";
import { FaCcJcb } from "react-icons/fa6";
import { FaCcDinersClub } from "react-icons/fa";
import { PiUnionFill } from "react-icons/pi";

function CardPay({ amount }) {
    const totalDuration = 10 * 60; // Total duration in seconds (10 minutes)
    const [remainingTime, setRemainingTime] = useState(totalDuration);
    // const creditCardType = require("credit-card-type");
    const [cardDetails, setCardDetails] = useState({
        acc: "XXXX XXXX XXXX XXXX",
        name: "",
        date: "",
    });
    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        }
    }, [remainingTime]);

    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const progressPercentage = (remainingTime / totalDuration) * 100;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercentage / 100) * circumference;

    const calculateColor = () => {
        const greenStart = { r: 76, g: 175, b: 80 }; // RGB for green-400
        const halfPoint = 50; // The percentage at which the color transitions from yellow to red

        if (progressPercentage > halfPoint) {
            // Green-400 to Yellow (50% to 100%)
            const green = greenStart.g; // Keep green at its original value
            const red = Math.floor(((100 - progressPercentage) / halfPoint) * 255);
            return `rgb(${red}, ${green}, 0)`; // Transition to yellow and red
        } else {
            // Yellow to Red (0% to 50%)
            const red = 255;
            const green = Math.floor(
                ((progressPercentage / halfPoint) * greenStart.g)
            );
            return `rgb(${red}, ${green}, 0)`; // Transition to red
        }
    };
   
    function getCardType(cardNumber) {
       
        const cardPatterns = [
          { type: "Visa", pattern: /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/ , logo:  <LiaCcVisa size={55} />},
          { type: "MasterCard", pattern: /^(?:5[1-5][0-9]{14}|2(?:2[2-9][0-9]{12}|[3-7][0-9]{13}))$/ , logo: <RiMastercardLine size={55}/> },
          { type: "American Express", pattern: /^3[47][0-9]{13}$/, logo: <SiAmericanexpress /> },
          { type: "Discover", pattern: /^6(?:011|5[0-9]{2}|22[1-9]|2[3-9][0-9]{2})[0-9]{12}$/ ,logo:<FaCcDiscover size={55}/> },
          { type: "JCB", pattern: /^(?:35[2-8][0-9]{13})$/ , logo: <FaCcJcb size={55}/> },
          { type: "Diners Club", pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/ , logo:<FaCcDinersClub size={55}/>},
          { type: "UnionPay", pattern: /^(62[0-9]{14,17})$/ , logo:<PiUnionFill size={55}/>},
         { type: "RuPay", pattern: /^(60|65|81|82)[0-9]{12,17}$/,  logo: <PiUnionFill size={55}/>}
        ];
      
        for (const card of cardPatterns) {
            console.log(card.pattern.test(cardNumber), "*")
          if (card.pattern.test(cardNumber)) {

            return card.logo;
          }
        }
        return "";
      }
      const handleCred = (e) => {
          const { name, value } = e.target;
          setCardDetails((prev) => ({ ...prev, [name]: value }));
          
          
        }
        console.log(cardDetails.acc, getCardType(cardDetails.acc) )

   
    return (

        <div className="w-full h-full flex justify-center">
            <div className="upi-container flex justify-center rounded-3xl modal-overlay">
                <div className="flex w-[60vw]  rounded-2xl justify-center h-[90vh] bg-white p-2">
                    <div className="bg-white h-[80vh] py-6 w-116 rounded-xl">
                        <div className="flex flex-col sm:flex-row justify-center items-center mb-2">
                        <div className="w-full flex justify-between items-center rounded-t-3xl p-4 text-white bank-header">

                        <div className="flex flex-col ">

                   
                        <p className="text-black text-xl">
                                Payment Time Left
                            </p>
                        </div>
                         <div className="flex-col items-center">
                            <div className="relative">
                                <svg
                                    className="progress-circle"
                                    width="80"
                                    height="80"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        className="progress-background"
                                        cx="50"
                                        cy="50"
                                        r="40" /* Adjusted radius for the new size */
                                        fill="none"
                                        stroke="#e5e5e5"
                                        strokeWidth="8" /* Scaled stroke width */
                                    />
                                    <circle
                                        className="progress-bar"
                                        cx="50"
                                        cy="50"
                                        r="40" /* Adjusted radius for the new size */
                                        fill="none"
                                        stroke={calculateColor()}
                                        strokeWidth="8" /* Scaled stroke width */
                                        strokeDasharray={2 * Math.PI * 40} /* Circumference based on new radius */
                                        strokeDashoffset={2 * Math.PI * 40 - (progressPercentage / 100) * 2 * Math.PI * 40}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)" /* Adjusted rotation center */
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gradient text-md font-bold">
                                        {formatTime(remainingTime)}
                                    </p>
                                </div>
                            </div>
                            
                        </div>  </div> 
                          </div>
                          <div className="flex justify-center items-center w-full h-12 text-3xl font-bold text-white rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-lg transform transition-transform duration-300 mb-2">
                            
                            ₹ {amount}
                            </div>
                        <div className="w-96 h-56 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-6 text-white relative">

                            <div className="w-12 h-8 bg-yellow-400 rounded-lg mb-4"></div>

                            <div className="mb-6">
                                <p className="text-lg font-semibold tracking-widest">{cardDetails.acc}</p>
                            </div>

                            {/* Card Details */}
                            <div className="flex justify-between items-center text-sm">
                                <div>
                                    <p className="uppercase text-gray-200">Cardholder</p>
                                    <p className="font-medium">{cardDetails.name}</p>
                                </div>
                                <div>
                                    <p className="uppercase text-gray-200">Expires</p>
                                    <p className="font-medium">{cardDetails.date}</p>
                                </div>
                            </div>

                            {/* Visa/MasterCard Logo */}
                            <div className="absolute bottom-2  right-7">
                                {/* <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Visa_2021.svg"
            alt="Visa Logo"
            className="w-12 h-auto"
            /> */}
            {  getCardType(cardDetails.acc)}
                                {/* <LiaCcVisa size={55} /> */}
                            </div>
                        </div>
                        <div>
                            <div className="w-full pt- flex justify-between mb-3 mt-5">

                                <div className="flex flex-col  item-center">
                                    <input onChange={handleCred} name="acc" className="px-2 py-1  text-gray-500  border-2 border-gray-100  focus:outline-none focus:border-green-500 rounded-lg" placeholder="Account Number" />
                                </div>
                                <div className="flex flex-col item-center">
                                    <input className="px-2 py-1 text-gray-500 borber-2 border-gray-100 w-[10vw] focus:outline-none border-2 focus:border-green-500 rounded-lg" placeholder="CVV" />
                                </div>
                            </div>
                            <div className="w-full flex justify-between mb-5 ">

                                <div className="flex flex-col item-center">
                                    <input onChange={handleCred} name="name" placeholder="Cardholder Name" className=" focus:outline-none border-3 focus:border-green-500 rounded-lg px-2 py-1 text-gray-500 border-2 border-gray-100" />
                                </div>
                                <div className="flex flex-col item-center">
                                    <input onChange={handleCred} name="date" placeholder="Expires on" className=" focus:outline-none border-3 focus:border-green-500 rounded-lg px-2 py-1 text-gray-500 border-2 border-gray-100" type="date" />
                                </div>
                            </div>
                            <button className="
                    bg-gradient-to-r  from-green-400 to-blue-500 w-full py-4 text-2xl text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-0 mt-4
                    ">
                                Submit
                            </button>

                        </div>
                    </div>
                </div>

            </div></div>

    )
}
export default CardPay;