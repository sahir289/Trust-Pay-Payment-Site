import { Upi, Chaticon, BankTransfer, Intent, CardPay, AmountPage } from "../../components";
import "./Transactions.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Transactions() {
    return (
        <>
            <Upi />
            {/* <BankTransfer /> */}
            {/* <Intent /> */}
            {/* <CardPay/> */}

            {/* <AmountPage/> */}

            {/* <Routes>
                <Route path="/" element={<AmountPage />} />

                <Route path="/upi" element={<Upi />} />
                <Route path="/banktranfer" element={<BankTransfer />} />
            </Routes> */}
            <Chaticon />
        </>
    )
}

export default Transactions