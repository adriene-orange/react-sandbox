# MirageJS Notes:

## Summary

### Pros
- Easier to maintain, dynamic mocking capabilities
- Can be used for a local development mock workflow
- Can be used as a mock server for Cypress tests
- Can be used as a mock server for "sociable component" tests
- Can be used as a mock server for any client unit tests that makes a network request (sagas, thunks, components)
- Centralized place for mocks, easy to remove/replace
- Encourages/enables the use of factories over hardcoded mocks
- More mature than hand rolling our own mock server

### Cons
- Documentation for library is not very clear
- Not a lot of secondary sources of documentation (blogs, stackoverflow, etc...)
- Cannot be used to intercept Node requests, would need a seprate tool for mocking external requests made by the server


### Blockers
- Requires Storefront client to be split from the server, at least for the mock workflow
- Going to require us to actually have API documentation in the server to know what the mocks should be


