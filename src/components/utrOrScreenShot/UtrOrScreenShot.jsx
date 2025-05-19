/* eslint-disable react/prop-types */
import { useState } from 'react';

function UtrOrScreenShot({ onSubmit }) {
  const [utrNumber, setUtrNumber] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUtrHovered, setIsUtrHovered] = useState(false);
  const [isFileHovered, setIsFileHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted || isLoading) return;

    if (!utrNumber.trim() && !file) {
      setError('Please provide either a UTR number or a screenshot.');
      return;
    }

    setError('');
    setIsLoading(true);
    setIsSubmitted(true);

    const formData = new FormData();
    formData.append('utrNumber', utrNumber);
    if (file) formData.append('screenshot', file);

    onSubmit(formData).finally(() => {
      setIsLoading(false);
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUtrChange = (e) => {
  const value = e.target.value;
  const isAlphaNumeric = /^[a-zA-Z0-9./|]*$/.test(value); 

  if (isAlphaNumeric) {
    setUtrNumber(value);
  }

  if (value.trim() || file) {
    setError('');
  }
};


  // Function to handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    // Reset the file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  // Show conflict message when hovering over a disabled input
  const showConflictMessage =
    (file && isUtrHovered) || (utrNumber.trim() && isFileHovered);

    return (
        <div className="text-center mb-4 mt-4 w-full mx-auto md:mx-0">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-center justify-center space-x-2">
                    <div className="flex-1 w-full">
                        <div className="flex justify-center relative">
                            <div className="relative w-full max-w-[70vw] sm:max-w-[40vw] md:max-w-[52vw] lg:max-w-[40vw] xl:max-w-[30vw] 2xl:max-w-[30vw] mb-2">
                                <input
                                    placeholder="Enter UTR Number"
                                    className={`bg-slate-100 border-2 border-blue-500 rounded-l-md w-full p-2 text-sm ${
                                        file || isSubmitted || isLoading
                                            ? 'cursor-not-allowed opacity-75'
                                            : ''
                                    }`}
                                    aria-label="Enter UTR Number"
                                    value={utrNumber}
                                    onChange={handleUtrChange}
                                    onMouseEnter={() => setIsUtrHovered(true)}
                                    onMouseLeave={() => setIsUtrHovered(false)}
                                    disabled={isSubmitted || isLoading || file}
                                />
                                {showConflictMessage && (
                                    <p className="text-red-600 text-sm mt-1 absolute w-full lg:max-w-[60vw] text-center">
                                        Enter UTR or Upload Screenshot
                                    </p>
                                )}
                            </div>
                            <label
                                htmlFor="file-upload"
                                className={`flex items-center justify-center h-[2.5rem] w-10 sm:w-12 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105 font-bold text-white py-1 px-2 rounded-r-md text-sm sm:text-lg ${
                                    isSubmitted || isLoading || utrNumber.trim()
                                        ? 'opacity-75 cursor-not-allowed'
                                        : 'cursor-pointer'
                                }`}
                                onMouseEnter={() => setIsFileHovered(true)}
                                onMouseLeave={() => setIsFileHovered(false)}
                            >
                                +
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={isSubmitted || isLoading || utrNumber.trim()}
                                />
                            </label>
                        </div>

            {/* File uploaded info with remove option */}
            {file && !error && (
              <div className="flex items-center justify-center mt-2">
                <p className="text-sm text-green-600">File uploaded: {file.name}</p>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-sm text-red-600 hover:underline"
                  aria-label="Remove uploaded file"
                >
                  Remove
                </button>
              </div>
            )}

            {/* No file, but form submitted */}
            {!file && isSubmitted && !error && (
              <p className="text-sm text-gray-600 mt-2 text-center">No file uploaded</p>
            )}

            {/* Error message */}
            {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
          </div>
        </div>

                <button
                    className="bg-gradient-to-r from-green-400 to-blue-500 w-full max-w-[80vw]
                     sm:max-w-[40vw] md:max-w-[65vw] lg:max-w-[60vw] xl:max-w-[70vw] 2xl:max-w-[30vw] py-2 text-lg
                      text-white shadow-lg transform transition-transform duration-300 hover:scale-105 rounded-md mb-2 mx-auto mt-5 block"
                    aria-label="Submit payment details"
          disabled={isSubmitted || isLoading}
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
  );
}

export default UtrOrScreenShot;