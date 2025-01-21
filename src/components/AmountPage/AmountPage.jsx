import { useState } from "react";
import "./AmountPage.css";
import { Upi } from "../upi";
import { BankTransfer } from "../bankTransfer";
import { CardPay } from "../CardPay";

function AmountPage({popupRef, closeChat}) {
    const [amount, setAmount] = useState("");
    const [selectMethod, setSelectMethod] = useState(false);
    const [click, setClick] = useState(false);
    const [increaseSize, setIncreaseSize] = useState(false); // New state to manage size change
    const [visible, setVisible] = useState(false)
    const [visibleBank, setVisibleBank] = useState(false)
    const [visiblecard, setVisiblecard] = useState(false)

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
            setVisible(true)
        }

        if (a === "cardpay") {
            setIncreaseSize(true); // Increase size
            setVisiblecard(true)
        }

        if (a === "bank") {
            setIncreaseSize(true); // Increase size
            setVisibleBank(true)
        }
    };

    
    return (
        <div ref={popupRef} className="flex justify-center items-center">
            <div
                className={`flex justify-center  ${increaseSize ? " " : "py-8 bg-[#f1f1eb] px-4 sm:px-8 rounded-3xl w-[21.6rem] lg:w-[36rem]  mt-8"}`} onClick={() => setClick(false)}
            >
                {
                    <div className="flex justify-center">
                        <div className={`rounded-3xl py-6 w-[20.4rem] lg:w-[32rem]  lg:shadow-md ${increaseSize ? "h-100  transition-active " : " bg-white "}`}>
                            <div className="flex flex-col px-2 mt-2  flex justify-center">
                                <label className="text-gray-500 text-xl px-4 py-1 cursor-pointer transform transition-transform rounded-sm duration-300 hover:scale-105 font-bold bg-white py-2 px-4 ">
                                    Please enter the amount :
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onClick={(e) => { e.stopPropagation(); setClick(true); }}
                                    onChange={handleAmount}
                                    className="focus:outline-none px-4 py-2 mt-1 mb-2 mx-4 border border-gray-200 rounded-md text-xl"
                                    style={{
                                        boxShadow: click ? '0 4px 10px rgba(0,0,0,0.1), 0 0 15px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 0, 255, 0.5)' : "none"
                                    }}
                                    placeholder="Enter New Amount Here"
                                />
                                <div className="flex justify-center">
                                    <button onClick={handleAmountSubmit}
                                        className="bg-gradient-to-r from-green-400 to-blue-500 w-[60rem] md:w-[46rem] h-10 font-bold text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-8 mt-4"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>

                            {selectMethod &&
                                <div className="mx-8">
                                    <h1 className="text-xl sm:text-2xl text-gray-500 font-bold px-6 py-2">Payment Method:</h1>
                                    <div className="flex flex-col  relative gap-4 lg:flex-row justify-center mt-5 mb-5 ">
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="w-64  h-16 lg:h-28 lg:w-32 flex justify-center items-center transform transition-transform duration-300 hover:scale-105 text-white text-xl font-bold  bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                                                onClick={() => handlePayClick("upi")}
                                            >
                                                UPI
                                            </button>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="w-64  h-16 lg:h-28 lg:w-32  items-center flex justify-center transform transition-transform duration-300 hover:scale-105 text-white text-xl font-bold  bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                                                onClick={() => handlePayClick("bank")}
                                            >
                                                Bank Transfer
                                            </button>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <button
                                                className=" w-64  h-16 lg:h-28 lg:w-32  items-center  flex justify-center transform transition-transform duration-300 hover:scale-105 text-white text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                                                onClick={() => handlePayClick("cardpay")}
                                            >
                                                Card Payment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                }

                <div className="absolute top-0 ">
                    {visible &&
                        <Upi amount={amount} closeChat={closeChat}/>
                    }
                </div>
                <div className="absolute top-0 ">
                    {visibleBank &&
                        <BankTransfer amount={amount} closeChat={closeChat}/>
                    }
                </div>
                <div className="absolute top-0 ">
                    {visiblecard &&
                        <CardPay amount={amount} closeChat={closeChat}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default AmountPage;