/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'react-router-dom';
import "./AmountPage.css";
import { Upi } from "../upi";
import { BankTransfer } from "../banktransfer";
import { CardPay } from "../CardPay";
import { validateToken, generatePayIn } from "../../services/transaction";
import { Modal } from '../modal';
import { ToastContainer, toast } from "react-toastify";

function AmountPage({ closeChat }) {
    const [amount, setAmount] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [merchantOrderId, setMerchantOrderId] = useState("");
    const [selectMethod, setSelectMethod] = useState(false);
    const [click, setClick] = useState(false);
    const [increaseSize, setIncreaseSize] = useState(false); // New state to manage size change
    const [visible, setVisible] = useState(false)
    const [visibleBank, setVisibleBank] = useState(false)
    const [visibleCard, setVisibleCard] = useState(false)
    const [isCode, setCode] = useState("");
    const [type, setType] = useState('upi');
    const [isValidated, setIsValidated] = useState(false); 
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user_id');
    const code = searchParams.get('code');
    const ot = searchParams.get('ot');
    const key = searchParams.get('key');
    const order = searchParams.get("order");
    const amountParam = searchParams.get("amount");
    const redirectUrl = searchParams.get("redirect_url");
    const [showExpiredModal, setShowExpiredModal] = useState(false);
    const [upi, setUpi] = useState(false);
    const [phonePay, setPhonePay] = useState(false);
    const [bank, setBank] = useState(false);

    const pathname = window.location.pathname;
    const hashCode = pathname.split('/transaction/')[1];

    const validateCalledRef = useRef(false);
    const apiCalledRef = useRef(false);

    useEffect(() => {
        if (Number(amountParam)) {
            setAmount(amountParam)
            setSelectMethod(true)
        }
    }, [amountParam])


    useEffect(() => {
        if (order && !validateCalledRef.current) {
            const fetchAndValidate = async () => {
                try {
                    validateCalledRef.current = true; // Set flag before API call
                    setMerchantOrderId(order);
                    const res = await validateToken(order);
                    if (res) {
                        setUpi(res.data.data.is_qr);
                        setPhonePay(res.data.data.is_phonepay);
                        setBank(res.data.data.is_bank);
                        setCode(res.data.data.code);
                        setMinAmount(res.data.data.min_amount);
                        setMaxAmount(res.data.data.max_amount);
                        if (res.data.data.amount > 0) {
                            setAmount(res.data.data.amount);
                            setSelectMethod(true);
                        }
                        setIsValidated(true); // Validation complete
                    }
                } catch (error) {
                    console.error('Error validating token:', error);
                    validateCalledRef.current = false; // Reset on error
                    // Show expired URL modal
                    setShowExpiredModal(true);
                    setIsValidated(true); // Allow rendering to show error modal
                }
            };
            fetchAndValidate();
        }
    }, [order]);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                // Only call API if it hasn't been called before and we have required params
                if (!apiCalledRef.current && userId && code && ot && key) {
                    apiCalledRef.current = true; // Mark API as called                    
                    const merchantOrderData = await generatePayIn(
                        userId,
                        code,
                        ot,
                        key,
                        amountParam ? amountParam : amount,
                        encodeURIComponent(hashCode) || hashCode // Pass the hashCode here
                    );
                    if (merchantOrderData?.error?.error?.message) {
                        toast.error(merchantOrderData?.error?.error?.message);
                        setTimeout(() => {
                            setShowExpiredModal(true)
                        }, 5000);
                        setIsValidated(true); // Allow rendering to show error
                    } else {
                        const merchantOrderId = merchantOrderData?.data?.data?.merchantOrderId;
                        setMerchantOrderId(merchantOrderId);

                        if (merchantOrderId) {
                            const res = await validateToken(merchantOrderId);
                            setUpi(res.data.data.is_qr);
                            setPhonePay(res.data.data.is_phonepay);
                            setBank(res.data.data.is_bank);
                            setMinAmount(res.data.data.min_amount);
                            setMaxAmount(res.data.data.max_amount);
                            if (res && res.data?.data?.amount > 0) {
                                setAmount(res.data.data.amount);
                                setSelectMethod(true);
                            }
                            setIsValidated(true); // Validation complete
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing payment:', error);
                apiCalledRef.current = false;
                setShowExpiredModal(true);
                setIsValidated(true); // Allow rendering to show error
            }
        };

        if (!order) {
            initializePayment();
        } else {
            // Ensure rendering after validateToken completes
            if (validateCalledRef.current) {
                setIsValidated(true);
            }
        }
    }, [userId, code, ot, key, hashCode, amountParam, amount, order]);

    const handleAmount = (e) => {
        setAmount(e.target.value);
    };

    const handleAmountSubmit = () => {
        if (amount) {
            const numericAmount = Number(amount);
            const numericMinAmount = Number(minAmount);
            const numericMaxAmount = Number(maxAmount);

            if (numericAmount < numericMinAmount || numericAmount > numericMaxAmount) {
                toast.error(`Error: Amount must be between ${numericMinAmount} and ${numericMaxAmount}`);
                return;
            }
            setSelectMethod(true);
        }
    };

    const handlePayClick = (a) => {

        if (a === "upi" && (!visibleBank && !visibleCard)) {
            setIncreaseSize(true); // Increase size
            setVisible(true)
        }

        if (a === "cardpay" && (!visibleBank && !visible)) {
            setIncreaseSize(true); // Increase size
            setVisibleCard(true)
        }

        if (a === "bank" && (!visible && !visibleCard)) {
            setIncreaseSize(true); // Increase size
            setVisibleBank(true)
        }
    };

    const handleChange = () => {
        setVisible(false);
        setVisibleCard(false);
        setVisibleBank(false);
        setIncreaseSize(false);
    };

    if (!isValidated) {
        return null;
    }

    return (
        <div onClick={closeChat} className="flex justify-center items-center">
            <div
                className={`flex justify-center  ${increaseSize ? " " : "py-8 bg-[#f1f1eb] px-4 sm:px-8 rounded-3xl w-[21.6rem] lg:w-[36rem]  mt-8"}`} onClick={() => { setClick(false) }}
            >
                <div className="flex justify-center">
                    <ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 9999 }} />
                    <div className={`rounded-3xl py-6 w-[20.4rem] lg:w-[32rem] lg:shadow-md ${increaseSize ? "h-100 transition-active " : " bg-white "}`}>
                        {!selectMethod && (
                            <div className="flex flex-col px-2 mt-2 justify-center">
                                <label className="text-gray-500 text-xl px-4 py-1 cursor-pointer transform transition-transform rounded-sm duration-300 font-bold">
                                    Please enter the amount :
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    disabled={selectMethod}
                                    onClick={(e) => { e.stopPropagation(); setClick(true); }}
                                    onChange={handleAmount}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && amount) {
                                            handleAmountSubmit();
                                        }
                                    }}
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
                                    <ToastContainer />
                                </div>
                            </div>
                        )}

                        {selectMethod && (
                            <div className="mx-8">
                                <ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 9999 }} />
                                <h1 className="text-xl sm:text-2xl text-gray-500 font-bold px-6 py-2">Payment Method:</h1>
                                <div className="flex flex-col relative gap-4 lg:flex-row justify-center mt-5 mb-5">
                                    {upi && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="w-64 h-20 lg:h-28 lg:w-40 flex flex-col justify-center items-center transform transition-transform duration-300 hover:scale-105 text-white text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg p-2"
                                                onClick={() => {
                                                    handlePayClick("upi");
                                                    setType("upi");
                                                }}
                                            >
                                                <span className="mb-2">UPI</span>
                                                {/* <div className="flex gap-2">
                                                    <img src={paytm} alt="PAYTM" className="w-8 h-8" />
                                                    <img src={googlePay} alt="Google Pay" className="w-8 h-8" />
                                                    <img src={bhim} alt="Bhim UPI" className="w-8 h-8" />
                                                </div> */}
                                            </button>
                                        </div>
                                    )}
                                    {phonePay && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="w-64 h-16 lg:h-28 lg:w-32 flex items-center justify-center transform transition-transform duration-300 hover:scale-105 text-white text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                                                onClick={() => {
                                                    handlePayClick("upi");
                                                    setType("phone_pe");
                                                }}
                                            >
                                                {/* <img src={phonePe} alt="Phone Pe" className="w-8 h-8" /> */}
                                                <span>Phone Pe</span>
                                            </button>
                                        </div>
                                    )}
                                    {bank && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="w-64 h-16 lg:h-28 lg:w-32 items-center flex justify-center transform transition-transform duration-300 hover:scale-105 text-white text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                                                onClick={() => handlePayClick("bank")}
                                            >
                                                Bank Transfer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute top-0">
                    {visible && (
                        <Upi
                            amount={amount}
                            code={code ? code : isCode}
                            merchantOrderId={merchantOrderId}
                            type={type}
                            closeChat={closeChat}
                            onBackClicked={handleChange}
                            isRedirectUrl={redirectUrl}
                        />
                    )}
                </div>
                <div className="absolute top-0 ">
                    {visibleBank &&
                        <BankTransfer amount={amount} code={code ? code : isCode} merchantOrderId={merchantOrderId} closeChat={closeChat} onBackClicked={handleChange} isRedirectUrl={redirectUrl} />
                    }
                </div>
                <div className="absolute top-0 ">
                    {visibleCard &&
                        <CardPay amount={amount} merchantOrderId={merchantOrderId} closeChat={closeChat} onBackClicked={handleChange} />
                    }
                </div>
            </div>
            {showExpiredModal && (
                <Modal
                    isOpen={showExpiredModal}
                    title="Payment URL is Expired"
                    message="The payment URL you provided has expired. Please generate a new URL and try again."
                    // onClose={() => setShowExpiredModal(false)}
                    type="EXPIRED"
                />
            )}
        </div>
    );
}

export default AmountPage;