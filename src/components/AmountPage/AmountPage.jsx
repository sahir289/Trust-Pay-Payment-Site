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
        // <div className="flex justify-center">
        <div
            className={`flex justify-center  ${increaseSize ? " " : "w-[100vw] sm:w-[100vw] md:w-[55vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw] amount-container   sm:mt-5   sm:rounded-3xl py-8 "} `} onClick={() => setClick(false)}
        >
            {
                 <div className="flex justify-center">
                <div className={`bg-white sm:px-8 pt-3 rounded-3xl shadow-md py-8 ${increaseSize ? "w-[90vw] sm:w-[98vw] z-0 element" : "sm:w-[45vw] md:w-[50vw] lg:w-[45vw] xl:w-[35vw] 2xl:w-[25vw]"} `}>
                <div className="flex flex-col px-2 mt-2 py-1 flex justify-center">
                   
                    

                    <label className="text-gray-500 text-xl px-4 py-1 cursor-pointer transform transition-transform rounded-sm duration-300 hover:scale-105 font-bold bg-white py-2 px-4 ">
                        Please enter the amount :
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
                    <div className="flex justify-center">
                    <button onClick={handleAmountSubmit} className="
                    bg-gradient-to-r from-green-400 to-blue-500 w-[80vw] sm:w-[70vw] xl:w-[25vw] 2xl:w-[20vw] lg:w-[35vw] py-2 text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-2 mt-4
                    ">
                        Submit
                    </button></div>
                </div>

                {selectMethod && <>
                    <h1 className="text-2xl text-gray-500 font-bold px-6 py-2">Payment Method:</h1>
                    <div className="flex flex-col lg:flex-row justify-center mt-5 mb-5 sm:w-full">
                       <div className="flex justify-center">
                        <button
                            className={`w-[70vw] md:w-[40vw] lg:w-[12vw] lg:py-6 xl:w-[8vw] h-[13vh] md:h-[13vh] md:py-8 flex flex justify-center sm:h-[20vh] xl:h-[15vh] 2xl:h-[10vh] 2xl:py-14 2xl:w-[6vw] xl:py-10  py-8 sm:py-4  md:py-6   text-white transform transition-transform duration-300 hover:scale-105  text-xl font-bold px-4 mx-2 my-2 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg transition-container`}
                            onClick={() => handlePayClick("upi")}
                        >
                            UPI
                        </button></div>
                        <div className="flex justify-center">
                        <button
                            className="w-[70vw] md:w-[40vw] lg:w-[12vw] xl:w-[8vw] h-[13vh] md:h-[13vh] md:py-8  flex justify-center sm:h-[20vh] xl:h-[15vh]  2xl:h-[10vh] 2xl:py-12 2xl:py-6 2xl:w-[6vw] xl:py-7 py-7 sm:py-5 md:py-6 lg:py-3 py-3 transform transition-transform duration-300 hover:scale-105  text-white text-xl font-bold px-4 mx-2 my-2 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                            onClick={() => handlePayClick("bank")}
                        >
                            Bank Transfer
                        </button></div>
                        <div className="flex justify-center">
                        <button
                            className="w-[70vw] md:w-[40vw] lg:w-[12vw] xl:w-[8vw] h-[13vh] md:h-[13vh] md:py-8  flex justify-center sm:h-[20vh] xl:h-[15vh]  2xl:h-[10vh] 2xl:py-12 2xl:py-6 2xl:w-[6vw] xl:py-7 py-7 sm:py-3 md:py-6 py-3 lg:py-3 transform transition-transform duration-300 hover:scale-105  text-white text-xl font-bold px-4  mx-2 my-2 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                            onClick={() => handlePayClick("cardpay")}
                        >
                            Card Payment
                        </button></div>
                    </div>
                </>}
            </div>
            </div>
            }
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
        // </div>
    );
}
        
export default AmountPage;