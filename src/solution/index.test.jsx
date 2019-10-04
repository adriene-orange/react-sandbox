import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HorribleATM from './index';

describe('<HorribleATM />', () => {
    test('on first render the balance, fees, withdraw and deposit inputs are visible', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$5');
        expect(getByText('Current Fees:', { exact: false })).toHaveTextContent('$0');
        const withdrawInput = getByLabelText('Withdraw');
        expect(withdrawInput).toBeVisible();
        expect(withdrawInput).not.toBeDisabled();
        expect(withdrawInput).toHaveValue(0);

        const depositInput = getByLabelText('Deposit');
        expect(depositInput).toBeVisible();
        expect(depositInput).not.toBeDisabled();
        expect(depositInput).toHaveValue(0);
    });
    test('users can withdraw and deposit money and see an updated balance', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Withdraw');
        const depositInput = getByLabelText('Deposit');

        fireEvent.change(withdrawInput, { target: { value: 1 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$4');

        fireEvent.change(depositInput, { target: { value: 21 }});
        fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$25');
    });
    test('when transaction amounts include change, the change is deposited as a fee and the leftover amount goes through', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Withdraw');
        const depositInput = getByLabelText('Deposit');

        fireEvent.change(withdrawInput, { target: { value: 16.50 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        const expectedAmount = 5 + (16 * 4);
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent(`$${expectedAmount}`);
        expect(getByText('Current Fees:', { exact: false })).toHaveTextContent('$0.50');
    });
    test('when the balance is <= 0 the fields are locked and a game over message is shown', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Withdraw');
        fireEvent.change(withdrawInput, { target: { value: 2 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        fireEvent.change(withdrawInput, { target: { value: 3 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$0');

        expect(getByLabelText('Withdraw')).toBeDisabled();
        expect(getByLabelText('Deposit')).toBeDisabled();

        expect(getByText('You Lose!')).toBeVisible();
    });
    test('when fees > balance the fields are locked and a game over message is shown', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Withdraw');
        fireEvent.change(withdrawInput, { target: { value: 101 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        fireEvent.change(withdrawInput, { target: { value: 101 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 });

        expect(getByText('Current Fees:', { exact: false })).toHaveTextContent('$10');
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$7');
        expect(getByLabelText('Withdraw')).toBeDisabled();
        expect(getByLabelText('Deposit')).toBeDisabled();

        expect(getByText('You Lose!')).toBeVisible();
    });
    test('when current balance reaches 42, the game is won', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const depositInput = getByLabelText('Deposit');
        fireEvent.change(depositInput, { target: { value: 37 }});
        fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 });
        fireEvent.change(depositInput, { target: { value: 42 }});
        fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 });
        fireEvent.change(depositInput, { target: { value: 32 }});
        fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 });

        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$42');
        expect(getByLabelText('Withdraw')).toBeDisabled();
        expect(getByLabelText('Deposit')).toBeDisabled();

        expect(getByText('You Win!')).toBeVisible();
    });
    describe('when the input is greater than the current balance', () => {
        test('if the user withdraws an amount between 100-999 a $5 fee is charged and $1 is deposited', () => {
            const { getByText, getByLabelText } = render(<HorribleATM />);
    
            const withdrawInput = getByLabelText('Withdraw');
            fireEvent.change(withdrawInput, { target: { value: 101 }});
            fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
            expect(getByText('Current Fees:', { exact: false })).toHaveTextContent('$5');
            expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$6');
        });
        test('when the withdraw amount is a multiple of four, 4x the amount is deposited instead', () => {
            const { getByText, getByLabelText } = render(<HorribleATM />);
    
            const withdrawInput = getByLabelText('Withdraw');
            fireEvent.change(withdrawInput, { target: { value: 16 }});
            fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
            const expectedBalance = 5 + (16 *4);
            expect(getByText('Current Balance:', { exact: false })).toHaveTextContent(`${expectedBalance}`);
        });
        test('when the deposit amount is >= 1000 the ATM laughs', () => {
            const { getByText, getByLabelText } = render(<HorribleATM />);
    
            const depositInput = getByLabelText('Deposit');
            fireEvent.change(depositInput, { target: { value: 1000 }});
            fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 })
            expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$5');
            expect(getByText('Hahaha', { exact: false })).toBeVisible();
        });
        test('when the deposit amount is even the ATM halves the depot amount', () => {
            const { getByText, getByLabelText } = render(<HorribleATM />);
    
            const depositInput = getByLabelText('Deposit');
            fireEvent.change(depositInput, { target: { value: 50 }});
            fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 })
            expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$30');
        });
        test('when the deposit amount is prime the balance is reset to 5', () => {
            const { getByText, getByLabelText } = render(<HorribleATM />);
    
            const depositInput = getByLabelText('Deposit');
            fireEvent.change(depositInput, { target: { value: 13 }});
            fireEvent.keyDown(depositInput, { key: 'Enter', keyCode: 13 })
            expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$5');
        });
    });
});