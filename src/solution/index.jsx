import React, { useState, useEffect, useRef } from 'react';



const HorribleATM = () => {
    const [currentBalance, updateBalance] = useState(5);
    const [currentFees, updateFees] = useState(0);

    const getWithdrawAmount = (userAmount) => {
        switch (userAmount) {
            case amount >= 100 && amount < 1000: {
                updateBalance(currentBalance + 1);
                updateFees(5);
            }
            default:
                updateBalance(currentBalance - userAmount);
        }
    }

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
            const userAmount = withdrawInput.current.value;
            if(userAmount >= 100 && userAmount < 1000) {
                updateBalance(currentBalance + 1);
                updateFees(currentFees + 5);
            } else if (userAmount % 4 === 0) {
                updateBalance(currentBalance + (userAmount * 4));
            } else {
                updateBalance(currentBalance - userAmount);
            }
            depositInput.current.value = 0;
        }
    }
    const gameOver = currentBalance <= 0 || currentFees > currentBalance;
    return (
        <div>
            { gameOver && <h1>You Lose!</h1>}
            <h3>Current Balance: ${currentBalance}</h3>
            <h3>Current Fees: ${currentFees}</h3>
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