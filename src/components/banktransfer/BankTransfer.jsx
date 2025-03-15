/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./BankTransfer.css";
import { UtrOrScreenShot } from '../utrOrScreenShot'
import { NortonAndVideoLink } from '../nortonAndVideoLink'
import { IoCopy } from "react-icons/io5";
import Modal from "../modal/modal";
import { Status } from "../../constants";
import { assignBankToPayInUrl, imageSubmit, processTransaction } from "../../services/transaction";
import ExpireModal from "../modal/expireUrl";
function BankTransfer({ amount, code, merchantOrderId, closeChat, onBackClicked }) {
    const totalDuration = 10 * 60; // Total duration in seconds (10 minutes)
    const [remainingTime, setRemainingTime] = useState(totalDuration);
    const [link, setLink] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalExpireOpen, setIsModalExpireOpen] = useState(false);
    const [bankDetails, setBankDetails] = useState({});
    const [transactionDetails, setTransactionDetails] = useState({});
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [redirectUrl, setRedirectUrl] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        getAssignedBank();
    }, []);

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

    const getAssignedBank = async () => {
        try {
            const res = await assignBankToPayInUrl(merchantOrderId, { 
                amount: amount, 
                type: 'upi' 
            });
            
            if (res?.data?.data?.bank) {
                setBankDetails(res.data.data.bank);
                setRedirectUrl(res.data.data.config?.urls?.return);
            }
        } catch (error) {
            setIsModalExpireOpen(true); 
            return
        }
    };
    
    const handleFormSubmit = async (formData) => {
        const userSubmittedUtr = formData.get('utrNumber');
        const screenShot = formData.get('screenshot');
    
        let res = {};
        try {
            if (userSubmittedUtr) {
                res = await processTransaction(merchantOrderId, {
                    userSubmittedUtr,
                    code,
                    amount,
                });
            } else if (screenShot) {
                res = await imageSubmit(merchantOrderId, {
                    amount,
                });
            }
    
            const transactionData = res?.data?.data;
            if (transactionData) {
                setTransactionDetails(transactionData);
                setTransactionStatus(getStatusTheme(transactionData.status));
                openModal();
            }
        } catch (error) {
            setIsModalExpireOpen(true); 
            return
        }
    };

    // Helper function to determine theme based on status
    const getStatusTheme = (status) => {
        switch (status) {
            case Status.SUCCESS:
                return 'green-theme';
            case Status.FAILED:
            case Status.DROPPED:
            case Status.BANK_MISMATCH:
            case Status.DISPUTE:
                return 'red-theme';
            default:
                return 'yellow-theme';
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Text copied to clipboard:");
            })
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
                                <p className="text-sm sm:text-lg mr-2">{bankDetails.nick_name}
                                    <button aria-label="Copy Bank Name" onClick={() => handleCopy(bankDetails.nick_name)}>
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
                                <p className="text-sm sm:text-lg mt-1 sm:mt-0 mr-2">{bankDetails.acc_no}
                                    <button aria-label="Copy Account Number" onClick={() => handleCopy(bankDetails.acc_no)}>
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
                                <p className="text-sm sm:text-lg  mr-2">{bankDetails.acc_holder_name}
                                    <button aria-label="Copy Name" onClick={() => handleCopy(bankDetails.acc_holder_name)}>
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
                                <p className="text-sm sm:text-lg  mr-2">{bankDetails.ifsc_code}
                                    <button aria-label="Copy IFSC Code" onClick={() => handleCopy(bankDetails.ifsc_code)}>
                                        <IoCopy className="h-4 w-4 ml-2" />
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                        <UtrOrScreenShot onSubmit={handleFormSubmit} />
                    </div>
                    <Modal isOpen={isModalOpen} amount={transactionDetails?.req_amount} orderId={transactionDetails.merchantOrderId} utr={transactionDetails.utr_id} redirectUrl={redirectUrl} theme={transactionStatus}></Modal>
                    <ExpireModal isOpen={isModalExpireOpen} theme="blue-theme"></ExpireModal>
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
