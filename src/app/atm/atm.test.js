import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AutomatedTellerMarvin from './atm';
import  * as locale from './locale';
import  * as constants from './constants';


describe('<AutomatedTellerMarvin />', () => {
    test('on first render insert card is the only available control', () => {
        const {  queryByText, getByText } = render(<AutomatedTellerMarvin />);
        expect(queryByText(locale.CURRENT_BALANCE_LABEL, { exact: false })).toEqual(null);
        expect(queryByText(locale.CURRENT_FEES_LABEL, { exact: false })).toEqual(null);
        expect(queryByText(locale.WITHDRAW_LABEL_TEXT)).toEqual(null);
        expect(queryByText(locale.DEPOSIT_LABEL_TEXT)).toEqual(null);

        const insertCardButton = getByText(locale.INSERT_CARD_TEXT);
        expect(insertCardButton).toBeVisible();
    });
    test('when the user clicks insert card insert card is gone -  remove card now on screen and is disabled', () => {
        const {  getByText } =  startupATM();

        const removeCardButton = getByText(locale.REMOVE_CARD_TEXT);
        expect(removeCardButton).toBeVisible();
        expect(removeCardButton).toBeDisabled();
    });
    test('when the user clicks insert card withdraw and deposit are available', () => {
        const { getByText } = startupATM();

        const withdrawInput = getByText(locale.WITHDRAW_LABEL_TEXT);
        expect(withdrawInput).toBeVisible();
        expect(withdrawInput).not.toBeDisabled();

        const depositInput = getByText(locale.DEPOSIT_LABEL_TEXT);
        expect(depositInput).toBeVisible();
        expect(depositInput).not.toBeDisabled();
    });
    test('when the user clicks insert card initial balance is 5 and fees are 0', () => {
        const { getByText } = startupATM();
        expect(getBalance(getByText)).toHaveTextContent(`${constants.STARTING_BALANCE}`);
        expect(getFees(getByText)).toHaveTextContent(`${constants.STARTING_FEES}`);
    });
    test('users can withdraw and deposit money and see an updated balance', () => {
        const {  getByText, getByLabelText } = startupATM();

        withdrawAmount(1, getByText, getByLabelText);
        expect(getBalance(getByText)).toHaveTextContent('$4');

        depositAmount(1, getByText, getByLabelText);
        expect(getBalance(getByText)).toHaveTextContent('$5');
    });
    test('when transaction amounts include change, the change is deposited as a fee and the leftover amount goes through', () => {
        const {  getByText, getByLabelText } = startupATM();

        withdrawAmount(1.25, getByText, getByLabelText);
        expect(getBalance(getByText)).toHaveTextContent('$4');
        expect(getFees(getByText)).toHaveTextContent('$0.25');
    });
    test('when the balance is <= 0 the game is lost', () => {
        const {  getByText, getByLabelText } = startupATM();

        withDrawToBalance( 0, 5, getByText, getByLabelText);
        expect(getByText(locale.YOU_LOSE_MESSAGE, { exact: false })).toBeVisible();
    });
    test('when fees > balance game is lost', () => {
        const {  getByText, getByLabelText } = startupATM();

        depositFeesToLoss(getByText, getByLabelText);
        expect(getByText(locale.YOU_LOSE_MESSAGE, { exact: false })).toBeVisible();
    });
    test('when current balance reaches 42 and user clicks remvoe card the game is won', () => {
        const {  getByText, getByLabelText, queryByText } = startupATM();

        depositAmount(74, getByText, getByLabelText);
        expect(queryByText(locale.YOU_WIN_MESSAGE)).toEqual(null);

        const removeCardButton = getByText(locale.REMOVE_CARD_TEXT);
        expect(removeCardButton).toBeVisible();
        expect(removeCardButton).not.toBeDisabled();

        fireEvent.click(removeCardButton);
        expect(getByText(locale.YOU_WIN_MESSAGE, { exact: false })).toBeVisible();
    });
    test('when current balance reaches 42 but keeps going the remove card button disables again', () => {
        const {  getByText, getByLabelText, queryByText } = startupATM();

        depositAmount(74, getByText, getByLabelText);
        expect(queryByText(locale.YOU_WIN_MESSAGE)).toEqual(null);

        const removeCardButton = getByText(locale.REMOVE_CARD_TEXT);
        expect(removeCardButton).toBeVisible();
        expect(removeCardButton).not.toBeDisabled();

        depositAmount(1, getByText, getByLabelText);

        expect(removeCardButton).toBeVisible();
        expect(removeCardButton).toBeDisabled();
    });
    describe('when the input is greater than the current balance', () => {
        test('if the user withdraws an amount between 100-999 a $5 fee is charged and $1 is deposited', () => {
            const {  getByText, getByLabelText } = startupATM();
    
            withdrawAmount(555, getByText, getByLabelText);
            expect(getBalance(getByText)).toHaveTextContent('$6');
            expect(getFees(getByText)).toHaveTextContent('$5');

            withdrawAmount(555, getByText, getByLabelText);
            expect(getBalance(getByText)).toHaveTextContent('$7');
            expect(getFees(getByText)).toHaveTextContent('$10');
        });
        test('when the withdraw amount is a multiple of four, 4x the amount is deposited instead', () => {
            const {  getByText, getByLabelText } = startupATM();
    
            withdrawAmount(80, getByText, getByLabelText);
            expect(getBalance(getByText)).toHaveTextContent('$' + (80 * 4 + 5) );
            expect(getFees(getByText)).toHaveTextContent('$0.00');
        });
        test('when the deposit amount is >= 1000 the ATM laughs', () => {
            const {  getByText, getByLabelText } = startupATM();
    
            depositAmount(1001, getByText, getByLabelText);
            expect(getByText(locale.LAUGHING_TEXT, { exact: false })).toBeVisible();

        });
        test('when the deposit amount is even the ATM halves the deposit amount', () => {
            const {  getByText, getByLabelText } = startupATM();
        
            depositAmount(98, getByText, getByLabelText);
            expect(getBalance(getByText)).toHaveTextContent('$' + (98/2+5));
        });
        test('when the deposit amount is prime the balance is reset to 5', () => {
            const {  getByText, getByLabelText } = startupATM();
    
            depositAmount(1, getByText, getByLabelText);
            expect(getBalance(getByText)).toHaveTextContent('$6');
    
            depositAmount(97, getByText, getByLabelText);
            expect(getBalance(getByText)).toHaveTextContent('$5');
    
        });
    });
});


// TESTING UTIL FUNCTIONS
const startupATM = () => {
    const atmControl = render(<AutomatedTellerMarvin />);
    const {  getByText, getByLabelText } = atmControl;
    const insertCardButton = getByText(locale.INSERT_CARD_TEXT);
    fireEvent.click(insertCardButton);
    return atmControl;
}

const getBalance = (getByText) => {
    return getByText(locale.CURRENT_BALANCE_LABEL, { exact: false });
}

const getFees = (getByText) => {
    return getByText(locale.CURRENT_FEES_LABEL, { exact: false });
}

const depositAmount = (amount, getByText, getByLabelText) => {
    fireEvent.click(getByText(locale.DEPOSIT_LABEL_TEXT));

    const depositInput = getByLabelText(locale.TRANSACTION_AMOUNT);
    fireEvent.change(depositInput, { target: { value: amount }});
    fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 })
}

const withdrawAmount = (amount, getByText, getByLabelText) => {
    fireEvent.click(getByText(locale.WITHDRAW_LABEL_TEXT));
    
    const withdrawInput = getByLabelText(locale.TRANSACTION_AMOUNT, {exact: false});
    fireEvent.change(withdrawInput, { target: { value: amount }});
    fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
}

const depositFeesToLoss = (getByText, getByLabelText) => {
    const depositsToMake = Math.ceil(constants.STARTING_BALANCE / 0.99);
    for(let i = 0; i < depositsToMake; i++ ){
        depositAmount( '0.99', getByText, getByLabelText);
    }
}

const withDrawToBalance = (endBalance, startingBalance, getByText, getByLabelText) => {
    const withdrawalsToMake = startingBalance - endBalance;
    for(let i = 0; i < withdrawalsToMake; i++ ){
        withdrawAmount(1, getByText, getByLabelText);
    }
}

