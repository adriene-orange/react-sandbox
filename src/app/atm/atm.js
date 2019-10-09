import React, { useState, useEffect, useRef } from 'react';
import  * as locale from './locale';
import  * as constants from './constants';

const AutomatedTellerMarvin = () => {
    const [currentBalance, updateBalance] = useState(constants.STARTING_BALANCE);
    const [currentMessage, setMessage] = useState('');

    const [currentFees, updateFees] = useState(constants.STARTING_FEES);
    const [currentMode, setCurrentMode] = useState(constants.MODE_WAITING_TO_START);

    const [removeCardDisabled, setRemoveDisabled] = useState(true);


    const transactionInput = useRef(null);

    const isPrime = (value) => {
        for(var i = 2; i < value; i++) {
            if(value % i === 0) {
                return false;
            }
        }
        return value > 1;
    }

    const resetGame = () => {
        updateBalance(constants.STARTING_BALANCE);
        updateFees(constants.STARTING_FEES);
        setMessage('');
        setCurrentMode(constants.MODE_WAITING_TO_START);
    }

    const insertCard = () => {
        setCurrentMode(constants.MODE_START);
        setMessage(locale.LIFE_QUESTION_TEXT);
    }

    const setRandomMessageFromArray = (stringArr) => {
        setMessage(stringArr[Math.floor(Math.random() * stringArr.length)]); 
    } 
    
    const showSnideComment = () => {
        setRandomMessageFromArray(locale.SNIDE_COMMENTS);
    }

    const showWinningMessage = () => {
        setRandomMessageFromArray(locale.WINNING_TEXT_MESSAGES);
    }

    const showLosingMessage = () => {
        setRandomMessageFromArray(locale.WINNING_TEXT_MESSAGES);
    }

    const withdrawClicked = () => {
            setCurrentMode(constants.MODE_WITHDRAW);
    } 
    
    const depositClicked = () => {
            setCurrentMode(constants.MODE_DEPOSIT);
    }

    const removeCardClicked = () => {
        setCurrentMode(constants.MODE_WIN);
    }

    const tansactionAmountKeyPress = (e) => {
        if (e.key === 'Enter') {
            showSnideComment();
            const [dollars,change] = transactionInput.current.value.split('.');
            switch (currentMode) {
                case constants.MODE_DEPOSIT:
                    handleChange(change);
                    depositAmount(Number.parseInt(dollars), Number.parseInt(change));
                    break;
                case constants.MODE_WITHDRAW:
                    handleChange(change);
                    withdrawAmount(Number.parseInt(dollars), Number.parseInt(change));
                    break;
            }
            transactionInput.current.value = '';
        }        
    }

    const balanceIsWinningValue = (balance) => {
        return Number.parseInt(balance) === constants.WINNING_BALANCE;
    }

    const handleChange = (change) => {
        if (change) {
            const newFee = currentFees + Number.parseFloat(change/100);
            updateFees(newFee);
        }    
    }

    const depositAmount = (dollars) => {
        if (dollars && dollars > currentBalance) {
            if(dollars >= 1000) {
                setMessage(locale.LAUGHING_TEXT);
            } else if (dollars % 2 === 0) {
                updateBalance(currentBalance + (dollars / 2));
            } else if (isPrime(dollars)) {
                updateBalance(5);
            } else {
                updateBalance(currentBalance + dollars);
            }
        } else {
            updateBalance(currentBalance + dollars);
        } 
    }

    
    const withdrawAmount = (dollars) => {
        if (dollars && dollars > currentBalance) {
            if (dollars >= 100 && dollars < 1000) {
                updateBalance(currentBalance + 1);
                updateFees(currentFees + 5);
            } else if (dollars % 4 === 0) {
                updateBalance(currentBalance + (dollars * 4));
            } else {
                updateBalance(currentBalance - dollars);
            }
        } else {
            updateBalance(currentBalance - dollars);
        }
    }

    if ( currentBalance <= 0 || currentFees >= currentBalance ) {
        if ( currentMode != constants.MODE_LOSE){
            setCurrentMode(constants.MODE_LOSE);
            showLosingMessage();
        }
    }
    if ( balanceIsWinningValue(currentBalance) && removeCardDisabled ) {
        setRemoveDisabled(false);
    }
    else if (!balanceIsWinningValue(currentBalance) && !removeCardDisabled) {
        setRemoveDisabled(true);
    }

    switch (currentMode) {
        case constants.MODE_WAITING_TO_START:
            return (
                <React.Fragment>
                    <button type="button" onClick={insertCard}>{locale.INSERT_CARD_TEXT}</button>
                </React.Fragment>
            )
            break;
        case constants.MODE_START:
            return (
                <React.Fragment>
                    <p>Marvin Says: {locale.LIFE_QUESTION_TEXT}</p>
                    <h3>{locale.CURRENT_BALANCE_LABEL} ${currentBalance}</h3>
                    <h3>{locale.CURRENT_FEES_LABEL} ${currentFees.toFixed(2)}</h3>

                    <button type="button" disabled={removeCardDisabled} onClick={removeCardClicked}>{locale.REMOVE_CARD_TEXT}</button>
                    <button type="button" onClick={withdrawClicked}>{locale.WITHDRAW_LABEL_TEXT}</button>
                    <button type="button" onClick={depositClicked}>{locale.DEPOSIT_LABEL_TEXT}</button>
                </React.Fragment>
            )
            break;
        case constants.MODE_DEPOSIT:
        case constants.MODE_WITHDRAW:
            return (
            <React.Fragment>
                <p><label>Marvin Says: <span>{currentMessage}</span></label></p>
                <h3>{locale.CURRENT_BALANCE_LABEL} ${currentBalance}</h3>
                <h3>{locale.CURRENT_FEES_LABEL} ${currentFees.toFixed(2)}</h3>

                <button type="button" disabled={removeCardDisabled} onClick={removeCardClicked}>{locale.REMOVE_CARD_TEXT}</button>
                <button type="button" onClick={withdrawClicked}>{locale.WITHDRAW_LABEL_TEXT}</button>
                <button type="button" onClick={depositClicked}>{locale.DEPOSIT_LABEL_TEXT}</button>
                <label>
                    {locale.TRANSACTION_AMOUNT}
                    <input  ref={transactionInput} placeholder="0.00" type="number" onKeyDown={tansactionAmountKeyPress}/>
                </label>
            </React.Fragment>
            )
            break;
        case constants.MODE_WIN:
            return (
            <React.Fragment>
                <h1>{locale.YOU_WIN_MESSAGE}</h1>
                <p>Marvin Says: {currentMessage}</p>
                <h3>{locale.CURRENT_BALANCE_LABEL} ${currentBalance}</h3>
                <h3>{locale.CURRENT_FEES_LABEL} ${currentFees.toFixed(2)}</h3>

                <button type="button" onClick={resetGame}>{locale.REMOVE_CARD_TEXT}</button>
            </React.Fragment>
            )
            break;
        case constants.MODE_LOSE:
            return (
            <React.Fragment>
                <h1>{locale.YOU_LOSE_MESSAGE}</h1>
                <p>Marvin Says: {currentMessage}</p>
                <h3>{locale.CURRENT_BALANCE_LABEL} ${currentBalance}</h3>
                <h3>{locale.CURRENT_FEES_LABEL} ${currentFees.toFixed(2)}</h3>

                <button type="button" onClick={resetGame}>{locale.REMOVE_CARD_TEXT}</button>
            </React.Fragment>
            )
            break;
        default:
            return (
                <p>Current mode : {currentMode}</p>
            )
            break;
    }


};

export default AutomatedTellerMarvin;