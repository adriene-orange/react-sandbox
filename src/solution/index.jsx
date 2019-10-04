import React, { useState, useEffect, useRef } from 'react';


const isPrime = (num)=> {
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
    // This is a little bit of optimization
    if (num <= 10) {
        return shortListOfPrimes[num];
    }
    // This will run in O(sqrt(n));
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
};


const HorribleATM = () => {
    const [currentBalance, updateBalance] = useState(5);
    const [currentFees, updateFees] = useState(0);
    const [isLaughing, toggleLaugh] = useState(false);

    const depositInput = useRef(null);
    const withdrawInput = useRef(null);
    const depositAmount = (e) => {
        if (e.key === 'Enter') {
            const [dollars,change] = depositInput.current.value.split('.');
            if (change) {
                updateFees(Number.parseFloat(change/10));
            }
            const userAmount = Number.parseInt(dollars);
            if (userAmount > currentBalance) {
                if(userAmount >= 1000) {
                    toggleLaugh(true);
                } else if (userAmount % 2 === 0) {
                    updateBalance(currentBalance + (userAmount / 2));
                } else if (isPrime(userAmount)) {
                    updateBalance(5);
                } else {
                    updateBalance(currentBalance + userAmount);
                }
            } else {
                updateBalance(currentBalance + userAmount);
            }
            depositInput.current.value = 0;
        }
    }
    const withdrawAmount = (e) => {
        if (e.key === 'Enter') {
            const [dollars,change] = withdrawInput.current.value.split('.');
            if (change) {
                updateFees(Number.parseFloat(change/10));
            }
            const userAmount = Number.parseInt(dollars);
            if (userAmount > currentBalance) {
                if (userAmount >= 100 && userAmount < 1000) {
                    updateBalance(currentBalance + 1);
                    updateFees(currentFees + 5);
                } else if (userAmount % 4 === 0) {
                    updateBalance(currentBalance + (userAmount * 4));
                } else {
                    updateBalance(currentBalance - userAmount);
                }
            } else {
                updateBalance(currentBalance - userAmount);
            }
            depositInput.current.value = 0;
        }
    }
    const userLost = currentBalance <= 0 || currentFees > currentBalance;
    const userWon = currentBalance === 42;
    const gameOver = userWon || userLost;
    return (
        <div>
            { userWon && <h1>You Win!</h1>}
            { userLost && <h1>You Lose!</h1>}
            { isLaughing && <h1>Hahaha</h1>}
            <h3>Current Balance: ${currentBalance}</h3>
            <h3>Current Fees: ${currentFees.toFixed(2)}</h3>
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