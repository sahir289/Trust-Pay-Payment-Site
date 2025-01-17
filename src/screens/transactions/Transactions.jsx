import { Upi, BankTransfer, Intent } from "../../components";
import AmountPage from "../../components/AmountPage/AmountPage";
import { CardPay } from "../../components/CardPay";
import { Chaticon } from "../../components/Chaticon";
import "./Transactions.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Transactions() {
    return (
        <>
            {/* <Upi /> */}
            {/* <BankTransfer /> */}
            {/* <Intent /> */}
            {/* <CardPay/> */}
           
            {/* <AmountPage/> */}
            
      {/* <Routes>
      <Route path="/" element={<AmountPage/>} />

        <Route path="/upi" element={<Upi/>} />
        <Route path="/banktranfer" element={<BankTransfer/>} />
      </Routes> */}
   



            <Chaticon/>
        </>
    )
}

export default Transactions