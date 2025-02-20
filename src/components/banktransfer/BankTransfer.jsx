import { useState, useEffect } from "react";
import "./BankTransfer.css";
import { UtrOrScreenShot } from '../utrOrScreenShot'
import { NortonAndVideoLink } from '../nortonAndVideoLink'
import { IoCopy } from "react-icons/io5";
import Modal from "../modal/modal";
function BankTransfer({ amount, closeChat, onBackClicked }) {
    const totalDuration = 10 * 60; // Total duration in seconds (10 minutes)
    const [remainingTime, setRemainingTime] = useState(totalDuration);
    const [link, setLink] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        setLink("https://www.youtube.com/embed/HZHHBwzmJLk");
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

    return (
        <div className="flex justify-center mt-3 py-2 px-2 rounded-3xl " onClick={closeChat}>
            <div className="bg-[#f1f1eb] rounded-3xl  shadow-md py-2 px-2  mt-4 ">
                <div className="bg-white p-3 rounded-3xl shadow-md ">
                    <div className="mb-5">
                        <div className="w-full flex justify-between rounded-t-3xl p-4 text-white">
                            <div className="flex flex-col items-center self-center">
                                <button
                                    onClick={() => onBackClicked()}
                                    className="mt-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
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
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center mb-2">
                            <div className="flex justify-center items-center w-full h-12 text-3xl font-bold text-white rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-lg transform transition-transform duration-300 mb-2">
                                ₹ {amount}
                            </div>
                        </div>

                        <div className="w-full flex justify-between mb-5 mt-5">
                            <div className="flex flex-col item-center">
                                <p className="text-md sm:text-lgmr-2">Bank Name</p>
                            </div>
                            <div className="flex flex-col item-center">
                                <p className="text-sm sm:text-lg mr-2">SAURABH
                                    <button aria-label="Copy Bank Name">
                                        <IoCopy className="h-4 w-4 ml-2" />
                                    </button>
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex justify-between mb-5 mt-5">
                            <div className="flex flex-col item-center">
                                <p className="text-lg mr-2">Account Number</p>
                            </div>
                            <div className="flex flex-col item-center">
                                <p className="text-sm sm:text-lg mt-1 sm:mt-0 mr-2">11451100000447
                                    <button aria-label="Copy Account Number">
                                        <IoCopy className="h-4 w-4 ml-2" />
                                    </button>
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex justify-between mb-5 mt-5">
                            <div className="flex flex-col item-center">
                                <p className="text-lg mr-2">Name</p>
                            </div>
                            <div className="flex flex-col item-center">
                                <p className="text-sm sm:text-lg  mr-2">SAURABH
                                    <button aria-label="Copy Name">
                                        <IoCopy className="h-4 w-4 ml-2" />
                                    </button>
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex justify-between mb-5 mt-5">
                            <div className="flex flex-col item-center">
                                <p className="text-lg mr-2">IFSC Code</p>
                            </div>
                            <div className="flex flex-col item-center">
                                <p className="text-sm sm:text-lg  mr-2">PSIB0021145
                                    <button aria-label="Copy IFSC Code">
                                        <IoCopy className="h-4 w-4 ml-2" />
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <UtrOrScreenShot />
                    </div>
                    <button className="bg-gradient-to-r from-green-400 to-blue-500 w-full py-2 text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-2 mt-4"
                        aria-label="Submit payment details " onClick={openModal}
                    >
                        SUBMIT
                    </button>
                    <Modal isOpen={isModalOpen} amount={amount} theme="green-theme"></Modal>
                    <p className="text-black text-start text-lg sm:text-base mb-4">
                        <b>Steps for Payment: </b>
                        <br />
                        1. Transfer the displayed Amount using the Bank Transfer.<span className="text-red-500">*</span>
                        <br />
                        2. Enter UTR number or upload screen shot.<span className="text-red-500">*</span>
                        <br />
                        3. Click on <b>Submit</b> to complete the payment.<span className="text-red-500">*</span>
                    </p>
                    <NortonAndVideoLink link={link} />
                </div>
            </div>
        </div>
    );
}

export default BankTransfer;
