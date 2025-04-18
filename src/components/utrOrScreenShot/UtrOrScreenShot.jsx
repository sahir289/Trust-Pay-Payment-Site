/* eslint-disable react/prop-types */
import { useState } from 'react';

function UtrOrScreenShot({ onSubmit }) {
    const [utrNumber, setUtrNumber] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state for loading

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitted || isLoading) return; // Prevent multiple submissions
        setIsLoading(true); // Show loading icon
        setIsSubmitted(true); // Disable further submissions
        const formData = new FormData();
        formData.append('utrNumber', utrNumber);
        if (file) formData.append('screenshot', file);
        // Simulate async submission (replace with actual onSubmit logic)
        onSubmit(formData).finally(() => {
            setIsLoading(false); // Hide loading icon after submission completes
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <>
            <div className='text-center mb-4 mt-4'>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex-1">
                            <div className="flex justify-end">
                                <input
                                    placeholder="Enter UTR Number"
                                    className="bg-slate-100 border-2 border-gray-300 rounded-md w-[90vw] sm:w-[40vw] md:w-[52vw] lg:w-[40vw] xl:w-[30vw] 2xl:w-[30vw] p-2 text-sm"
                                    aria-label="Enter UTR Number"
                                    value={utrNumber}
                                    onChange={(e) => setUtrNumber(e.target.value)}
                                    title="Please enter a UTR number"
                                    disabled={isSubmitted || isLoading} // Disable during loading/submitted
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`absolute cursor-pointer h-[2.5rem] w-[11vw] sm:w-[5vw] from-green-400 to-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105 font-bold bg-gradient-to-r text-white py-1 px-1 sm:px-3 rounded-r-md text-sm sm:text-lg ${isSubmitted || isLoading ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    +
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={isSubmitted || isLoading} // Disable during loading/submitted
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        className={`bg-gradient-to-r from-green-400 to-blue-500 w-full py-2 text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-2 mt-4 ${isSubmitted || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label="Submit payment details"
                        disabled={isSubmitted || isLoading} // Disable during loading/submitted
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 mx-auto text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                ></path>
                            </svg>
                        ) : (
                            'SUBMIT'
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}

export default UtrOrScreenShot;