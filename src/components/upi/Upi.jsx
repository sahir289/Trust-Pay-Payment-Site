/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import './Upi.css';
import { UtrOrScreenShot } from '../utrOrScreenShot';
import { NortonAndVideoLink } from '../nortonAndVideoLink';
import { QrGenerator } from '../qr-generator';
import { IoCopy } from 'react-icons/io5';
import { SiPhonepe, SiGooglepay, SiPaytm } from "react-icons/si";
import Modal from '../modal/modal';
import {
  assignBankToPayInUrl,
  generateUpiUrls,
  imageSubmit,
  processTransaction,
} from '../../services/transaction';
import { Status } from '../../constants';
import { toast } from 'react-toastify';
function Upi({
  amount,
  code,
  isRedirectUrl,
  merchantOrderId,
  type,
  closeChat,
  onBackClicked,
}) {
  const totalDuration = 10 * 60; // Total duration in seconds (10 minutes)
  const [remainingTime, setRemainingTime] = useState(totalDuration);
  const [link, setLink] = useState();
  const placeholderRef = useRef(null);
  const [size, setSize] = useState(300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalExpireOpen, setIsModalExpireOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({});
  const [transactionDetails, setTransactionDetails] = useState({});
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    setLink('https://www.youtube.com/embed/HZHHBwzmJLk');
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on component unmount
    } else {
      setIsModalExpireOpen(true);
      setIsModalOpen(false);
    }
  }, [remainingTime]);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // Skip if already run
    hasRun.current = true;
    getAssignedBank();
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (placeholderRef.current) {
        const { width, height } =
          placeholderRef.current.getBoundingClientRect();
        const newSize = Math.min(width, height) * 1;
        setSize(newSize);
      }
    };

    // Initial size calculation
    updateSize();

    // Recalculate size when window resizes or screen orientation changes
    const resizeObserver = new ResizeObserver(updateSize);
    if (placeholderRef.current) {
      resizeObserver.observe(placeholderRef.current);
    }

    return () => {
      if (placeholderRef.current) {
        resizeObserver.unobserve(placeholderRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
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
      const green = Math.floor((progressPercentage / halfPoint) * greenStart.g);
      return `rgb(${red}, ${green}, 0)`; // Transition to red
    }
  };

  const getAssignedBank = async () => {
    try {
      const res = await assignBankToPayInUrl(merchantOrderId, {
        amount: amount,
        type: type,
      });

      if (res?.data?.data?.bank) {
        setBankDetails(res.data.data.bank);
        setRedirectUrl(isRedirectUrl ? isRedirectUrl : res.data.data.return);
      } else if (res?.error?.error) {
        setIsModalExpireOpen(true);
        setIsModalOpen(false);
        toast.error(`Error: ${res?.error?.error?.message}`);
      } else {
        setIsModalExpireOpen(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      setIsModalExpireOpen(true);
      setIsModalOpen(false);
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
        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('file', screenShot);
        res = await imageSubmit(merchantOrderId, formData);
      }

      const transactionData = res?.data?.data;
      if (transactionData) {
        setTransactionDetails(transactionData);
        setTransactionStatus(getStatusTheme(transactionData.status));
        setIsModalOpen(true);
      } else {
        setIsModalExpireOpen(true);
        setIsModalOpen(false);
      }
    } catch (error) {
      setIsModalExpireOpen(true);
      setIsModalOpen(false);
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
      case Status.PENDING:
        return 'yellow-theme';
      default:
        return 'yellow-theme';
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard:');
    });
  };

  const [upiUrls, setUpiUrls] = useState({
    phonepe: '',
    gpay: '',
    paytm: '',
    generic: '',
    transactionId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpiUrls = async () => {
      try {
        const payload = {
            amount,
            payeeVPA: bankDetails?.upi_id,
            payeeName: 'Trust-Pay',
            transactionNote: code,
            businessName: 'Trust-Pay',
          };
    
          const response = await generateUpiUrls(payload);

        if (!response) {
          throw new Error('Failed to generate UPI URLs');
        }
        setUpiUrls(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error generating payment links. Please try again.');
        setLoading(false);
      }
    };

    fetchUpiUrls();
  }, []);


  const openUpiLink = (upiUrl, fallbackUrl, appName) => {
    console.log(`Attempting to open ${appName} with URL: ${upiUrl}`);
  
    const packageMap = {
      'PhonePe': 'com.phonepe.app',
      'Google Pay': 'com.google.android.apps.nbu.paisa.user',
      'Paytm': 'net.one97.paytm',
    };
  
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  
    let opened = false;
  
    if (isAndroid && packageMap[appName]) {
      const intentUrl = `intent://pay?${upiUrl.split('?')[1]}#Intent;scheme=upi;package=${packageMap[appName]};S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
  
      window.location.href = intentUrl;
    } else if (isIOS) {
      // iOS doesn't support UPI deep links, show QR or fallback
      toast.error(`Opening ${appName} is not supported on iOS. Please use the QR code.`);
      return;
    } else {
      window.location.href = upiUrl;
    }
  
    // Fallback check after delay
    setTimeout(() => {
      if (!document.hidden && !document.visibilityState?.includes('hidden')) {
        console.warn(`${appName} app did not open, redirecting to fallback`);
        if (fallbackUrl) {
          window.location.href = fallbackUrl;
        } else {
          toast.error(`Please install ${appName} to proceed.`);
        }
      } else {
        console.log(`${appName} app opened successfully`);
      }
    }, 2000);
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center" onClick={closeChat}>
      <div className="w-full sm:h-full">
        <div className="bg-[#f1f1eb] rounded-3xl  shadow-md py-2 px-2  mt-6 ">
          {/* <AmountPage className="w-full h-screen bg-blur-lg p-6 sm:p-12 md:p-16 lg:p-20 xl:p-24"/> */}
          <div className="bg-white w-90 p-3  rounded-3xl shadow-md ">
            <div className="mb-5 ">
              <div className="w-full flex justify-between rounded-t-3xl p-4 text-white upi-header">
                <div className="flex flex-col items-center self-center">
                  {/* <button
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
                                    </button> */}
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
                        strokeDasharray={
                          2 * Math.PI * 40
                        } /* Circumference based on new radius */
                        strokeDashoffset={
                          2 * Math.PI * 40 -
                          (progressPercentage / 100) * 2 * Math.PI * 40
                        }
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
                <div className="flex justify-center items-center w-full h-12 text-3xl font-bold text-white rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-4 shadow-lg transform transition-transform duration-300 mb-2">
                  ₹ {amount}
                </div>
              </div>
              <p className="text-black text-center text-lg sm:text-base mb-2">
                Scan QR Code to Pay
              </p>
              <div className="flex justify-center">
                <div
                  ref={placeholderRef}
                  className="flex justify-center items-center w-[12.5rem] "
                >
                  <div className="qr-code" aria-label="QR Code Placeholder">
                    <QrGenerator
                      upi_id={bankDetails?.upi_id}
                      amount={amount}
                      size={size}
                    />
                  </div>
                </div>
              </div>

              <p className="text-red-500 text-center text-lg sm:text-base mb-4 mt-4">
                <b>ATTENTION: </b>Avoid depositing through PhonePe for any
                inconvenience
              </p>

                <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
                  <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Pay {amount} to {bankDetails?.upi_id}
                  </h1>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() =>
                        openUpiLink(
                          upiUrls.upiUrl,
                          'https://play.google.com/store/apps/details?id=com.phonepe.app',
                          'PhonePe'
                        )
                      }
                      className="flex-1 flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-50 transition"
                    >
                      <SiPhonepe />
                      <span className="text-sm font-medium text-gray-700">
                        PhonePe
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        openUpiLink(
                          upiUrls.upiUrl,
                          'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user',
                          'Google Pay',
                        )
                      }
                      className="flex-1 flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-50 transition"
                    >
                      <SiGooglepay />
                      <span className="text-sm font-medium text-gray-700">
                        GPay
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        openUpiLink(
                          upiUrls.upiUrl,
                          'https://play.google.com/store/apps/details?id=net.one97.paytm',
                          'Paytm',
                        )
                      }
                      className="flex-1 flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-50 transition"
                    >
                      <SiPaytm />
                      <span className="text-sm font-medium text-gray-700">
                        Paytm
                      </span>
                    </button>
                    <button
                      onClick={() => openUpiLink(upiUrls.upiUrl, '', 'Other UPI Apps')}
                      className="flex-1 flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-50 transition"
                    >
                      {/* <TbAppsFilled /> */}
                      <span className="text-sm font-medium text-gray-700">
                        Other UPI Apps
                      </span>
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Don’t have the app?{' '}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.phonepe.app"
                      className="text-blue-600 hover:underline"
                    >
                      PhonePe
                    </a>
                    ,{' '}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user"
                      className="text-blue-600 hover:underline"
                    >
                      Google Pay
                    </a>
                    ,{' '}
                    <a
                      href="https://play.google.com/store/apps/details?id=net.one97.paytm"
                      className="text-blue-600 hover:underline"
                    >
                      Paytm
                    </a>
                  </p>
                </div>

              <div className="flex items-center justify-center mb-4">
                <p className="text-lg mr-2">{bankDetails?.upi_id}</p>
                <button
                  aria-label="Copy UPI ID"
                  onClick={() => handleCopy(bankDetails?.upi_id)}
                >
                  <IoCopy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-5 flex justify-center">
              <UtrOrScreenShot onSubmit={handleFormSubmit} />
            </div>
            <Modal
              isOpen={isModalOpen}
              amount={transactionDetails?.req_amount}
              orderId={transactionDetails.merchantOrderId}
              title={transactionDetails?.status}
              redirectUrl={redirectUrl}
              utr={transactionDetails.utr_id}
              theme={transactionStatus}
              type={transactionDetails?.status}
            />
            <Modal
              isOpen={isModalExpireOpen}
              title="Payment URL is Expired"
              type="EXPIRED"
              message="The payment URL has expired. Please try again."
            />
            <p className="text-black text-start text-lg sm:text-base mb-5">
              <b>Steps for Payment: </b>
              <br />
              1. Scan the QR code displayed above.
              <span className="text-red-500">*</span>
              <br />
              2. Enter either UTR number or upload screen shot.
              <span className="text-red-500">*</span>
              <br />
              3. Click on <b>Submit</b> to complete the payment.
              <span className="text-red-500">*</span>
            </p>
            <NortonAndVideoLink link={link} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upi;
