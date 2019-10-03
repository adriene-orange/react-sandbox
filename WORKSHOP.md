# Workshop

Try out the react testing library while building something to frustrate your friends and coworkers.

You can write the component first or try out TDD.
OPTIONAL CHALLENGE: Do not run `npm start` or manually test your code until you have finished your tests.
 
 1. Create the world's most frustrating ATM
 2. On first load the component renders the account's current balance of $5, atm fees paid is $0
 3. Users can withdraw or add money to their account
 4. The rules of the ATM are:
    1. If the balance reaches 0 or below the account locks and the user loses
    2. If the number of fees exceed the current balance, the user loses
    3. If the withdraw/deposit amount includes change take the change as a transaction fee. 
    4. If the user withdraws money that is greater than their current balance:
       1. If the amount is a multiple of 4, multiply it by 4 and deposit it instead of withdrawing
       2. If the amount is between 100-999, deposit $1 and take a $5 fee
       3. let all other withdraws subtract from the current balance
    5. If the user deposits money that is greater than their current balance
       1. If the amount is greater than or equal to 1000 swallow the money and laugh
       2. If the amount is even, half it before depositing it
       3. If the amount is a prime number, the current balance is reset to 5, fees remain the same
       4. let all other deposits add to the current balance
    6. If the current balance is $42 the user wins

