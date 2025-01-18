import React, { useState, useEffect } from "react";
import "./Intent.css";
import { NortonAndVideoLink } from '../nortonAndVideoLink'

function Intent() {
    const totalDuration = 10 * 60; // Total duration in seconds (10 minutes)
    const [remainingTime, setRemainingTime] = useState(totalDuration);
    const [selected, setSelected] = useState(null);
    const [link, setLink] = useState();

    const handleSelect = (index) => {
        setSelected(index);
    };

    const paymentOptions = [
        { id: 1, name: "Google Pay", img: "src/assets/google-pay.svg" },
        { id: 2, name: "Phone Pe", img: "src/assets/phone-pe.svg" },
        { id: 3, name: "Paytm", img: "src/assets/paytm.svg" },
        { id: 4, name: "Bhim UPI", img: "src/assets/bhim.svg" },
    ];

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
        <div className="intent-container rounded-3xl">
            <div className="bg-white p-3 rounded-3xl shadow-md intent-body">
                <div className="mb-5">
                    <div className="w-full flex justify-between rounded-t-3xl p-4 text-white intent-header">
                        <div className="flex flex-col items-center self-center">
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
                                        r="40"
                                        fill="none"
                                        stroke="#e5e5e5"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        className="progress-bar"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke={calculateColor()}
                                        strokeWidth="8"
                                        strokeDasharray={2 * Math.PI * 40}
                                        strokeDashoffset={2 * Math.PI * 40 - (progressPercentage / 100) * 2 * Math.PI * 40}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
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
                            ₹900
                        </div>
                    </div>

                    <div className="w-full flex justify-around mb-5 mt-5">
                        <div
                            className={`grid ${selected !== null ? "grid-cols-1 place-items-center" : "grid-cols-2 gap-4"
                                }`}
                        >
                            {paymentOptions.map((option, index) => {
                                // Determine the animation class based on the index or position
                                const getAnimationClass = (index) => {
                                    switch (index) {
                                        case 0: // Top-left
                                            return "animate-top-left";
                                        case 1: // Top-right
                                            return "animate-top-right";
                                        case 2: // Bottom-left
                                            return "animate-bottom-left";
                                        case 3: // Bottom-right
                                            return "animate-bottom-right";
                                        default:
                                            return "";
                                    }
                                };

                                return selected === null || selected === index ? (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelect(index)}
                                        className={`flex items-center justify-center p-4 border rounded-lg shadow transition-all
                                            ${selected === index
                                                ? `scale-110 text-black bg-gray-200 ${getAnimationClass(index)}`
                                                : "bg-gray-200 hover:bg-gray-300"
                                            }
                                        `}
                                        aria-label={`Select ${option.name}`}
                                    >
                                        <img
                                            src={option.img}
                                            alt={option.name}
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span className="text-lg font-medium">{option.name}</span>
                                    </button>
                                ) : null; // Remove non-selected items when an option is selected
                            })}
                        </div>
                    </div>

                </div>
                <button
                    className="bg-gradient-to-r from-green-400 to-blue-500 w-full py-2 text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-2 mt-4"
                    aria-label="Submit payment details"
                >
                    PAY
                </button>
                <p className="text-black text-start text-lg sm:text-base mb-4">
                    <b>Steps for Payment: </b>
                    <br />
                    1. Select the UPI App from which you want to pay.<span className="text-red-500">*</span>
                    <br />
                    2. Click on "Submit" to complete the payment.<span className="text-red-500">*</span>
                    <br />
                    3. Pay the display Amount.<span className="text-red-500">*</span>
                </p>
                <NortonAndVideoLink link={link} />
            </div>
        </div>
    );
}

export default Intent;
