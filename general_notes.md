## Client

- AuthForm.jsx component is not imported anywhere. Do you use it? If not I would suggest to delete it.

- MapDisplay.test.jsx won't work, because you have here jest. Jest can not be configured for the client in this case. If you want to add unit testing, I would recommend to try with vitest. But the unit testing does nothing for user and it may only help you with development.

- ErrorBoundary.jsx may be deleted completely. It is class component, which is old and not used anymore.
