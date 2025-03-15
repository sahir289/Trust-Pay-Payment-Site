/* eslint-disable react/prop-types */
import { useState } from 'react';

function UtrOrScreenShot({ onSubmit }) {
    const [utrNumber, setUtrNumber] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('utrNumber', utrNumber);
        if (file) formData.append('screenshot', file);
        onSubmit(formData);
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
                                    placeholder="Enter 12-Digit UTR Number"
                                    className="bg-slate-100 border-2 border-gray-300 rounded-md w-[90vw] sm:w-[40vw] md:w-[52vw] lg:w-[40vw] xl:w-[30vw] 2xl:w-[30vw] p-2 text-sm"
                                    aria-label="Enter UTR Number"
                                    value={utrNumber}
                                    onChange={(e) => setUtrNumber(e.target.value)}
                                    maxLength={12}
                                    pattern="[0-9]{12}"
                                    title="Please enter a 12-digit UTR number"
                                />
                                <label htmlFor="file-upload"
                                    className={`absolute cursor-pointer h-[2.5rem] w-[11vw] sm:w-[5vw] from-green-400 to-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105 text-xl font-bold bg-gradient-to-r text-white py-1 px-1 sm:px-3 rounded-r-md text-sm sm:text-lg`}
                                >
                                    +
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                    <button className="bg-gradient-to-r from-green-400 to-blue-500 w-full py-2 text-lg text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-lg mb-2 mt-4"
                        aria-label="Submit payment details">
                        SUBMIT
                    </button>
                </form>
            </div>
        </>
    );
}

export default UtrOrScreenShot;