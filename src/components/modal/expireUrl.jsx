/* eslint-disable react/prop-types */
import "./modal.css";

const ExpireModal = ({ isOpen, theme }) => {
  // If modal is not open, return null
  if (!isOpen) return null;

  const appliedTheme = theme || "green-theme";

  return (
    <>
      <div className="fixed top-0 bg-white bg-opacity-20 backdrop-blur-md left-0 w-full h-full opacity-80"></div>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-transparent backdrop-blur-sm">
        <div className={`parent ${appliedTheme}`}>
          <div className="card">
            <div className="glass"></div>
            <div className="content">
              <span className="title">Payment URL is Expired</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpireModal;