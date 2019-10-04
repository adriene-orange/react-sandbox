import React, { useState, useEffect, useRef } from 'react';

const shortListOfPrimes = {
    0: false,
    1: true,
    2: true,
    3: true,
    4: false,
    5: true,
    6: false,
    8: false,
    9: false,
    10: false,
};

const isPrime = (num)=> {
    // This is a little bit of optimization
    if (num <= 10) {
        return shortListOfPrimes[num];
    }
    // This will run in O(sqrt(n));
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
}

const HorribleATM = () => {
    const [currentBalance, updateBalance] = useState(5);
    const [currentFees, updateFees] = useState(0);
    const [isLaughing, toggleLaugh] = useState(false);

    const depositInput = useRef(null);
    const withdrawInput = useRef(null);
    const depositAmount = (e) => {
        if (e.key === 'Enter') {
            const userAmount = Number.parseFloat(depositInput.current.value);
            if(userAmount >= 1000) {
                toggleLaugh(true);
            } else if (userAmount % 2 === 0) {
                updateBalance(currentBalance + (userAmount / 2));
            } else if (isPrime(userAmount)) {
                updateBalance(5);
            } else {
                updateBalance(currentBalance + userAmount);
            }
            depositInput.current.value = 0;
        }
    }
    const withdrawAmount = (e) => {
        if (e.key === 'Enter') {
            const userAmount = Number.parseFloat(withdrawInput.current.value);
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
            { isLaughing && <h1>Hahaha</h1>}
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