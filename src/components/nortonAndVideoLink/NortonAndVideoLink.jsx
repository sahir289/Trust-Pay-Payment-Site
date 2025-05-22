import { useState } from "react";
import norton from "../../assets/norton.png"
import pci from "../../assets/pci.png"

function NortonAndVideoLink({linkUrl, lang}) {
    const [showVideo, setShowVideo] = useState(false);
    const [video, setVideo] = useState();
    return (
        <>
            <div className='text-center mb-4 mt-4'>
                <div className="flex items-center justify-center">
                    <img
                        src={norton}
                        alt={lang.nortonLogoAlt}
                        className="h-12 w-auto"
                    />
                    <img
                        src={pci}
                        alt={lang.pciLogoAlt}
                        className="h-12 w-auto ml-4"
                    />
                </div>
                <div className="items-center justify-center mt-5">
                    <h2 className="text-black font-semibold mb-2">
                        {!showVideo && (
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setVideo(linkUrl.link);
                                    setShowVideo(true); // Show the video when clicked
                                }}
                                className="text-black font-medium hover:underline"
                            >
                                {lang.watchVideoInstructions}
                            </a>
                        )}
                    </h2>

                    {showVideo && (
                        <div
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg overflow-hidden"
                            style={{
                                width: "40%",
                                maxWidth: "600px",
                                paddingBottom: "30.25%",
                            }}
                        >
                            <iframe
                                src={video}
                                title={lang.quickDepositInstructions}
                                // frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                            ></iframe>
                            <button
                                onClick={() => setShowVideo(false)}
                                className="absolute top-2 right-2 text-black bg-gray-300 rounded-full p-1 hover:bg-gray-400"
                                aria-label={lang.closeVideo}
                            >
                                &times; {/* Close icon (X) */}
                            </button>
                        </div>
                    )}

                    <div className="space-y-2 mt-2">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.telugu} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.gujarati} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.bengali} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.hindi} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.tamil} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.english} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.kannada} -
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setVideo(linkUrl.link);
                                setShowVideo(true); // Show the video when a language link is clicked
                            }}
                            className="text-black font-medium hover:underline"
                        >
                            {lang.malayalam} 
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NortonAndVideoLink