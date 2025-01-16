function UtrOrScreenShot() {
    return (
        <>
            <div className='text-center mb-4 mt-4'>
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex-1">
                        <input
                            placeholder="Enter 12-Digit UTR Number"
                            className="bg-slate-100 border border-gray-300 rounded-md w-full p-2 text-sm"
                            aria-label="Enter UTR Number"
                        />
                    </div>
                    <p className='font-bold mb-2'>Or</p>
                    <div className="flex items-center justify-center">
                        <label htmlFor="file-upload" className="cursor-pointer bg-gradient-to-r from-green-400 to-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105 text-white py-2 px-4 rounded-full">
                            Upload ScreenShot
                        </label>
                        <input id="file-upload" type="file" className="hidden" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UtrOrScreenShot