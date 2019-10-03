import React, { useState, useEffect, useRef } from 'react';


const HorribleATM = () => {
    const [currentBalance, updateBalance] = useState(5);
    const depositInput = useRef(null);
    const withdrawInput = useRef(null);
    const depositAmount = (e) => {
        if (e.key === 'Enter') {
            const newBalance = currentBalance + Number.parseFloat(depositInput.current.value);
            updateBalance(newBalance);
            depositInput.current.value = 0;
        }
    }
    const withdrawAmount = (e) => {
        if (e.key === 'Enter') {
            const newBalance = currentBalance - Number.parseFloat(withdrawInput.current.value);
            updateBalance(newBalance);
            depositInput.current.value = 0;
        }
    }
    const gameOver = currentBalance <= 0;
    return (
        <div>
            { gameOver && <h1>You Lose!</h1>}
            <h3>Current Balance: ${currentBalance}</h3>
            <h3>Current Fees: $0</h3>
            <label>
                Deposit
                <input disabled={gameOver} ref={depositInput} defaultValue="0" type="number" onKeyDown={depositAmount}/>
            </label>
            <label>
                Withdraw
                <input disabled={gameOver} ref={withdrawInput} defaultValue="0" type="number" onKeyDown={withdrawAmount}/>
            </label>
        </div>
    )
};

export default HorribleATM;