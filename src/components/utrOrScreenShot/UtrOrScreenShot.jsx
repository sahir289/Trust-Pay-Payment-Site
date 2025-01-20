function UtrOrScreenShot({ isUpi }) {
    return (
        <>
            <div className='text-center mb-4 mt-4'>
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex-1">
                        <input
                            placeholder="Enter 12-Digit UTR Number"
                            className=" bg-slate-100 border-2 border-gray-300 rounded-md w-[90vw] sm:w-[40vw] md:w-[52vw] lg:w-[40vw] xl:w-[30vw] 2xl:w-[30vw] p-2 text-sm"
                            aria-label="Enter UTR Number"
                        />
                        <label htmlFor="file-upload" 
                           className={`absolute cursor-pointer h-[2.5rem] w-[11vw] sm:w-[5vw] from-green-400 to-blue-500 shadow-lg transform transition-transform duration-300 hover:scale-105 text-xl font-bold bg-gradient-to-r text-white py-1 px-1 sm:px-3 rounded-r-md text-sm sm:text-lg ${
                            isUpi
                                ? 
                                "right-4 sm:right-12 md:left-[51vw] lg:left-[39vw] xl:left-[27.5vw] 2xl:left-[26.5vw]"
                                : 
                                "right-4 sm:right-12 md:left-[51vw] lg:left-[40vw] xl:left-[31.5vw] 2xl:left-[31.5vw]"

                        }`}
                        
                        >
                            +
                        </label>
                        <input id="file-upload" type="file" className="hidden" />

                    </div>

                </div>
            </div>
        </>
    )
}

export default UtrOrScreenShot