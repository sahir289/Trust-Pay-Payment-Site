/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import "./AmountPage.css";
import { Upi } from "../upi";
import { BankTransfer } from "../banktransfer";
import { CardPay } from "../CardPay";
import { validateToken, generatePayIn } from "../../services/transaction";
import { Modal } from '../modal';
import { ToastContainer, toast } from "react-toastify";
import { languageConfig } from "../utils/language";
import { manageTimer } from "../../utils/timer";

function AmountPage({ closeChat }) {
    const totalDuration = 10 * 60; 
    const [amount, setAmount] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [merchantOrderId, setMerchantOrderId] = useState("");
    const [selectMethod, setSelectMethod] = useState(false);
    const [click, setClick] = useState(false);
    const [increaseSize, setIncreaseSize] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleBank, setVisibleBank] = useState(false);
    const [visibleCard, setVisibleCard] = useState(false);
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
    const [showExpiredModal, setShowExpiredModal] = useState(false);
    const [upi, setUpi] = useState(false);
    const [phonePay, setPhonePay] = useState(false);
    const [bank, setBank] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);
    // Timer state
    const [remainingTime, setRemainingTime] = useState(totalDuration);
    const [accessDenied, setAccessDennied] = useState(false);    const [expireTime] = useState(Date.now() + 10 * 60 * 1000);
    const [startTime] = useState(Date.now());
    const pathname = window.location.pathname;
    const hashCode = pathname.split('/transaction/')[1];
    const validateCalledRef = useRef(false);
    const apiCalledRef = useRef(false);
    const navigate = useNavigate();
    ///set time in session storage
    const [language, setLanguage] = useState("en"); 
    const lang = languageConfig[language];
    useEffect(() => {
        sessionStorage.setItem("expireSession", expireTime);
        sessionStorage.setItem("startSession", startTime);  
   },[expireTime,startTime])
    
    // Timer logic
    useEffect(() => {
        if (showExpiredModal) return;
        if (remainingTime > 0) {
            //timer for url expired 10 mins
            manageTimer(totalDuration, setRemainingTime,remainingTime, setShowExpiredModal)
        } else {
            setShowExpiredModal(true);
        }
    }, [showExpiredModal, expireTime, startTime, totalDuration, remainingTime]);

    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const progressPercentage = (remainingTime / totalDuration) * 100;

    const calculateColor = () => {
        const greenStart = { r: 76, g: 175, b: 80 }; 
        const halfPoint = 50; 

        if (progressPercentage > halfPoint) {
            const green = greenStart.g;
            const red = Math.floor(((100 - progressPercentage) / halfPoint) * 255);
            return `rgb(${red}, ${green}, 0)`;
        } else {
            const red = 255;
            const green = Math.floor((progressPercentage / halfPoint) * greenStart.g);
            return `rgb(${red}, ${green}, 0)`;
        }
    };

    useEffect(() => {
        if (Number(amountParam)) {
            setAmount(amountParam);
            setSelectMethod(true);
        }
    }, [amountParam]);

    useEffect(() => {
        if (order && !validateCalledRef.current) {
            const fetchAndValidate = async () => {
                try {
                    validateCalledRef.current = true;
                    setMerchantOrderId(order);
                    const res = await validateToken(order);
                    if (res?.data?.data?.error) {
                        setRedirectUrl(res?.data?.data?.result?.redirect_url);
                        setShowExpiredModal(true);
                        setIsValidated(true);
                    } else if (res?.data?.data){
                        setUpi(res?.data?.data?.is_qr);
                        setPhonePay(res?.data?.data?.is_phonepay);
                        setBank(res?.data?.data?.is_bank);
                        setCode(res?.data?.data?.code);
                        setMinAmount(res?.data?.data?.min_amount);
                        setMaxAmount(res?.data?.data?.max_amount);
                        setRedirectUrl(res?.data?.data?.redirect_url);
                        if (res?.data?.data?.amount > 0) {
                            setAmount(res?.data?.data?.amount);
                            setSelectMethod(true);
                        }
                        setIsValidated(true);
                    }else if(res.error){
                        setShowExpiredModal(true);
                        setAccessDennied(res.error.error.message);
                    }
                }catch {
                    validateCalledRef.current = false;
                    setShowExpiredModal(true);
                    setIsValidated(true);
                }
            };
            fetchAndValidate();
        }
    }, [order]);
    useEffect(() => {
        const initializePayment = async () => {
            try {
                if (!apiCalledRef.current && userId && code && ot && key) {
                    apiCalledRef.current = true;
                    const merchantOrderData = await generatePayIn(
                        userId,
                        code,
                        ot,
                        key,
                        amountParam ? amountParam : amount,
                        encodeURIComponent(hashCode) || hashCode
                    );
                    if (merchantOrderData?.error?.error?.message) {
                        toast.error(merchantOrderData?.error?.error?.message);
                        setTimeout(() => {
                            setShowExpiredModal(true);
                        }, 5000);
                        // setIsValidated(true); // Allow rendering to show error
                    } else {
                        const merchantOrderId = merchantOrderData?.data?.data?.merchantOrderId;
                        setMerchantOrderId(merchantOrderId);

                        if (merchantOrderId) {
                            const newSearchParams = new URLSearchParams();
                            newSearchParams.set('order', merchantOrderId);
                            if (amount) newSearchParams.set('amount', amount);
                            navigate(`?${newSearchParams.toString()}`, { replace: true });
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing payment:', error);
                apiCalledRef.current = false;
                setShowExpiredModal(true);
                // setIsValidated(true); // Allow rendering to show error
            }
        };

        if (!order) {
            initializePayment();
        } else {
            if (validateCalledRef.current) {
                // setIsValidated(true); //show modal after validate api 
            }
        }
    }, [userId, code, ot, key, hashCode, amountParam, amount, order, navigate]);

    const handleAmount = (e) => {
        const inputValue = e.target.value;
        const isValid = /^\d{1,10}$/.test(inputValue);
        if (isValid || inputValue === "") {
          setAmount(inputValue);
        }
      };

    const handleAmountSubmit = () => {
        if (amount) {
            const numericAmount = Number(amount);
            const numericMinAmount = Number(minAmount);
            const numericMaxAmount = Number(maxAmount);

            if (numericAmount < numericMinAmount || numericAmount > numericMaxAmount) {
                toast.error(`${lang.invalidAmount} ${numericMinAmount} ${lang.and} ${numericMaxAmount}`);
                return;
            }
            setSelectMethod(true);
        }
    };

    const handlePayClick = (a) => {
        if (a === "upi" && (!visibleBank && !visibleCard)) {
            setIncreaseSize(true);
            setVisible(true);
        }
        if (a === "cardpay" && (!visibleBank && !visible)) {
            setIncreaseSize(true);
            setVisibleCard(true);
        }
        if (a === "bank" && (!visible && !visibleCard)) {
            setIncreaseSize(true);
            setVisibleBank(true);
        }
        sessionStorage.clear();
        // setRemainingTime(totalDuration);
        // setExpireTime(new Date(Date.now() + 10 * 60 * 1000));
        // setStartTime((new Date()));
    };

    const handleChange = () => {
        setVisible(false);
        setVisibleCard(false);
        setVisibleBank(false);
        setIncreaseSize(false);
    };

    if (!isValidated && !showExpiredModal) {
        // return null;
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div onClick={closeChat} className="flex justify-center items-center">
            <select
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
                className="absolute top-4 right-4 bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 transition-all"
            >
                <option value="en">🌐 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="gu">🏳️ ગુજરાતી</option>
                <option value="bn">🏳️ বাংলা</option>
                <option value="ta">🏳️ தமிழ்</option>
                <option value="te">🏳️ తెలుగు</option>
                <option value="kn">🏳️ ಕನ್ನಡ</option>
                <option value="ml">🏳️ മലയാളം</option>
            </select>


            <div
                className={`flex justify-center ${increaseSize ? " " : "py-8 bg-[#f1f1eb] px-4 sm:px-8 rounded-3xl w-[21.6rem] lg:w-[36rem] mt-8"}`}
                onClick={() => { setClick(false); }}
            >
                <div className="flex justify-center">
                    <ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 9999 }} />
                    <div className={`rounded-3xl py-6 w-[20.4rem] lg:w-[32rem] lg:shadow-md ${increaseSize ? "h-100 transition-active " : " bg-white "}`}>
                        {!selectMethod && (
                            <div className="flex flex-col px-2 mt-2 justify-center">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-gray-500 text-xl px-4 py-1 cursor-pointer transform transition-transform rounded-sm duration-300 font-bold">
                                        {lang.enterAmountLabel}
                                    </label>
                                    {/* <div className="relative">
                                        <svg
                                            className="progress-circle"
                                            width="60"
                                            height="60"
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
                                            <p className="text-gradient text-sm font-bold">
                                                {formatTime(remainingTime)}
                                            </p>
                                        </div>
                                    </div> */}
                                </div>
                                {/* <p className="text-red-500 text-center text-sm mb-4">
                                    <b>{lang.attention} </b>{lang.attentionEnterAmount}
                                </p> */}
                                <input
                                    type="number"
                                    value={amount}
                                    disabled={selectMethod}
                                    onClick={(e) => { e.stopPropagation(); setClick(true); }}
                                    onChange={handleAmount}
                                    onKeyDown={(e) => {
                                        if (e.key === ".") {
                                            e.preventDefault();
                                          }
                                        if (e.key === "Enter" && amount) {
                                            handleAmountSubmit();
                                        }
                                    }}
                                    className="focus:outline-none px-4 py-2 mt-1 mb-2 mx-4 border border-gray-200 rounded-md text-xl"
                                    style={{
                                        boxShadow: click ? '0 4px 10px rgba(0,0,0,0.1), 0 0 15px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 0, 255, 0.5)' : "none"
                                    }}
                                    placeholder={lang.enterAmountPlaceholder}
                                />
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleAmountSubmit}
                                        className="bg-gradient-to-r from-green-400 to-blue-500 w-[60rem] md:w-[46rem] h-10 font-bold text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-8 mt-4"
                                    >
                                        {lang.submit}
                                    </button>
                                    <ToastContainer />
                                </div>
                            </div>
                        )}

                        {selectMethod && (
                            <div className="mx-8">
                                <ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 9999 }} />
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-xl sm:text-2xl text-gray-500 font-bold px-6 py-2">{lang.paymentMethod}</h1>
                                    {/* <div className="relative">
                                        <svg
                                            className="progress-circle"
                                            width="60"
                                            height="60"
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
                                            <p className="text-gradient text-sm font-bold">
                                                {formatTime(remainingTime)}
                                            </p>
                                        </div>
                                    </div> */}
                                </div>
                                {/* <p className="text-red-500 text-center text-sm mb-4">
                                    <b>{lang.attention}: </b>{lang.attentionSelectMethod}
                                </p> */}
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
                                                <span className="mb-2">{lang.upi}</span>
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
                                                <span>{lang.phonePe}</span>
                                            </button>
                                        </div>
                                    )}
                                    {bank && (
                                        <div className="flex justify-center items-center">
                                            <button
                                                className="w-64 h-16 lg:h-28 lg:w-32 items-center flex justify-center transform transition-transform duration-300 hover:scale-105 text-white 
                                                text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg"
                                                onClick={() => handlePayClick("bank")}
                                            >
                                                {lang.bankTransfer}
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
                            lang={lang}
                        />
                    )}
                </div>
                <div className="absolute top-0">
                    {visibleBank && (
                        <BankTransfer
                            amount={amount}
                            code={code ? code : isCode}
                            merchantOrderId={merchantOrderId}
                            closeChat={closeChat}
                            onBackClicked={handleChange}
                            isRedirectUrl={redirectUrl}
                            lang={lang}
                        />
                    )}
                </div>
                <div className="absolute top-0">
                    {visibleCard && (
                        <CardPay
                            amount={amount}
                            merchantOrderId={merchantOrderId}
                            closeChat={closeChat}
                            onBackClicked={handleChange}
                            lang={lang}
                        />
                    )}
                </div>
            </div>
            {showExpiredModal && (
                <Modal
                    isOpen={showExpiredModal}
                    title={accessDenied ? `${lang.accessDeniedTitle}` : `${lang.paymentUrlExpiredTitle}`}
                    redirectUrl={redirectUrl}
                    message={lang.paymentUrlExpiredMessage}
                    type="EXPIRED"
                    lang={lang}
                />
            )}
        </div>
    );
}

export default AmountPage;