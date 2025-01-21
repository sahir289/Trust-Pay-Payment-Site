// import React from 'react'
import QRCode from 'react-qr-code';

const QrGenerator = ({ upi_id, amount, size }) => {
    const payload = `upi://pay?pa=${upi_id}&am=${amount}&cu=INR`
    return (
        <div>
            <QRCode value={payload} size={size} />
        </div>
    )
}

export default QrGenerator;