Currency-Exchange-Server-Side is a server-side application built with Node.js and Express.js that provides real-time exchange rate data to users. 
The application fetches exchange rate data from the Open Exchange Rates API, and stores it in a MongoDB database.

The API has multiple endpoints that can be used to fetch data for a specific currency, or for a list of currencies. 
Users can query the API for the latest exchange rate, or for a historical exchange rate for a specific date. The API also provides an endpoint to
fetch a list of available currencies, and an endpoint to convert a given amount from one currency to another.

The application uses JWT for authentication and authorization, and bcryptjs for hashing user passwords. Users can create an account and log in to 
the application to access protected routes, 
such as the currency conversion endpoint. The API also includes error handling middleware, which returns descriptive error messages to the client in the event 
of an error.

Overall, Currency-Exchange-Server-Side is a useful tool for developers who need real-time exchange rate data for their applications. The API is easy
to use and provides accurate and up-to-date exchange rate information.
