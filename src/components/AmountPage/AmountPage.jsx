import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AmountPage.css";
import { Upi } from "../upi";
import { BankTransfer } from "../bankTransfer";
import { CardPay } from "../CardPay";

function AmountPage() {
    const [amount, setAmount] = useState("");
    const [selectMethod, setSelectMethod] = useState(false);
    const [zoming, setZoming] = useState(false);
    const [click, setClick] = useState(false);
    const [increaseSize, setIncreaseSize] = useState(false); // New state to manage size change
    const [blueColor, setBlueColor] = useState(false); // New state for color change
    const [visible, setVisible] = useState(false)
    const [visibleBank, setVisibleBank] = useState(false)
    const [visiblecard, setVisiblecard] = useState(false)

    const navigate = useNavigate();

    const handleAmount = (e) => {
        setAmount(e.target.value);
    };

    const handleAmountSubmit = () => {
        if (amount) {
            setSelectMethod(true);
        }
    };

    const handlePayClick = (a) => {
        if (a === "upi") {

            setIncreaseSize(true); // Increase size
            // navigate('/upi'); // Navigate to UPI page
            setVisible(true)
        }
        if (a === "cardpay") {
            setIncreaseSize(true); // Increase size
            // navigate('/upi'); // Navigate to UPI page
            setVisiblecard(true)
        }
        if (a === "bank") {
            setIncreaseSize(true); // Increase size
            // navigate('/upi'); // Navigate to UPI page
            setVisibleBank(true)
        }
    };


    return (
        <div
            //   className={`amount-container h-full w-full rounded-3xl py-8  `}
            onClick={() => setClick(false)}
        >
            {<div className={`bg-white  p-3 rounded-3xl shadow-md py-8 ${increaseSize ? " w-[100%] z-0 element" : "w-[50vw]"}`}>
                <div className="flex flex-col px-2 mt-2 py-1">
                    <div className="flex flex-col items-center self-center">

                    </div>

                    <label className="text-gray-500 text-xl px-4 py-1 cursor-pointer transform transition-transform rounded-sm duration-300 hover:scale-105 font-bold bg-white py-2 px-4 ">
                        Please enter the amount for this transaction :
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onClick={(e) => { e.stopPropagation(); setClick(true); }}
                        onChange={handleAmount}
                        className="focus:outline-none px-4 py-2 mt-8 mb-2 mx-4 border border-gray-200 rounded-md text-xl"
                        style={{
                            boxShadow: click ? '0 4px 10px rgba(0,0,0,0.1), 0 0 15px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 0, 255, 0.5)' : "none"
                        }}
                        placeholder="Enter New Amount Here"
                    />
                    <button onClick={handleAmountSubmit} className="
                    bg-gradient-to-r from-green-400 to-blue-500 w-full py-2 text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-2 mt-4
                    ">
                        Submit
                    </button>
                </div>

                {selectMethod && <>
                    <h1 className="text-2xl text-gray-500 font-bold px-6 py-2">Select Payment Method:</h1>
                    <div className="flex flex-row justify-start mt-5 mb-5 w-full">
                        <button
                            className={`w-[30vw] text-white transform transition-transform duration-300 hover:scale-105  text-xl font-bold px-4 py-8 mx-2 my-2 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg transition-container`}
                            onClick={() => handlePayClick("upi")}
                        >
                            UPI
                        </button>
                        <button
                            className="w-[30vw] transform transition-transform duration-300 hover:scale-105  text-white text-xl font-bold px-4 py-8 mx-2 my-2 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                            onClick={() => handlePayClick("bank")}
                        >
                            Bank Transfer
                        </button>
                        <button
                            className="w-[30vw] transform transition-transform duration-300 hover:scale-105  text-white text-xl font-bold px-4 py-8 mx-2 my-2 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                            onClick={() => handlePayClick("cardpay")}
                        >
                            Card Payment
                        </button>
                    </div>
                </>}
            </div>}
            {/* <div className="absolute top-0 left-0 w-full h-full z-10"> */}

            {/* <BankTransfer /> */}
            {visible &&
                <Upi amount={amount} />
            }
            {visibleBank &&
                <BankTransfer amount={amount} />
            }
            {visiblecard && <CardPay amount={amount} />}
            {/* </div> */}
        </div>
    );
}

export default AmountPage;
