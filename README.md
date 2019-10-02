# React Testing Workshop


## Summary of topics
- Behavior Driven Development (BDD)
  - How small should a unit test be?
  - Is there value in testing implementation details?
- Enzyme
  - Bad testing patterns
  - The drawbacks and strengths of `shallow` and `mount`
- React Testing Library
  - Pit of success
  - Potential drawbacks to html rendering

## Description
This is a React workshop aimed towards QuoteCenter developers. This workshop focuses on comparing the testing libraries `enzyme` and `@testing-library/react` with a focus on BDD (Behavior Driven Development). This repo uses `parceljs` to build and serve a simple React To Do component that will be used for testing and leverages `jest` as its test runner.


For the first portion of the workshop, we will examine common testing patterns and mistakes that currently are seen in QuoteCenter React applications. Then we will look at what better testing patterns would look like using `enzyme`.

Next we will look at similar tests done with `@testing-library/react` and discuss the benefits of utilizing a library that focuses explicitly on BDD.

## Getting started

- Clone the repository, within the project directory run `npm i` or `npm install`
- To confirm that the application is working, run `npm start` 

### The To Do App

The component we are testing is a basic To Do app found at `./src/toDoList/index.jsx`.
The expected behavior of the component:

- On render displays an input form and button for adding new tasks
- A user can add a new task and see the task show up as a list item
- A user can update the task's status 
- A user can delete a task

### Getting setup to play with tests
The instructions for each subset of the workshop can be found in PR's:

- [Enzyme PR](https://github.com/adriene-orange/react-sandbox/pull/1)
- [Go to the Test Library PR](https://github.com/adriene-orange/react-sandbox/pull/2)

