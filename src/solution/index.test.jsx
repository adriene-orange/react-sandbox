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
    test('users can withdraw and deposity money and see an updated balance', () => {
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
    test('if the user withdraws an amount between 100-999 a $5 fee is charged and $1 is deposited', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Withdraw');
        fireEvent.change(withdrawInput, { target: { value: 101 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Fees:', { exact: false })).toHaveTextContent('$5');
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$6');
    })
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
    test('when the withdraw amount is a multiple of four, 4x the amount is deposited instead', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Withdraw');
        fireEvent.change(withdrawInput, { target: { value: 4 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        const expectedBalance = 5 + (4 *4);
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent(`${expectedBalance}`);
    });
    test('when the deposit amount is greater than the balance and >= 1000 the ATM laughs', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Deposit');
        fireEvent.change(withdrawInput, { target: { value: 1000 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$5');
        expect(getByText('Hahaha', { exact: false })).toBeVisible();
    });
    test('when the deposit amount is greater than the balance and even the ATM halfs the depot amount', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Deposit');
        fireEvent.change(withdrawInput, { target: { value: 50 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$30');
    });
    test('when the deposit amount is greater than the balance and prime the balance is reset to 5', () => {
        const { getByText, getByLabelText } = render(<HorribleATM />);

        const withdrawInput = getByLabelText('Deposit');
        fireEvent.change(withdrawInput, { target: { value: 5 }});
        fireEvent.keyDown(withdrawInput, { key: 'Enter', keyCode: 13 })
        expect(getByText('Current Balance:', { exact: false })).toHaveTextContent('$5');
    });
});