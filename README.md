# Bitespeed Backend API

This project implements a backend API for managing customer identities and handling identity reconciliation tasks. It is built with Node.js and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/AmanMalviya22/bitespeed-backend.git
    cd bitespeed-backend
    ```

2. Install dependencies:
   Prerequisites:
   Nodejs- download from https://nodejs.org/en
   MongoDB- download from https://www.mongodb.com/try/download/community
   MongoDB compass for Mongodb visualization, download from https://www.mongodb.com/products/tools/compass

    ```bash
    npm install, will install all the dependencies.
    ```

4. Set up environment variables:

    Create a `.env` file in the root of the project and add your MongoDB connection string:

    ```env
    replace the connection string to localhost or create a acccount of mongodb cloud platfrom and get a connection string and use it.
    localhost url- mongodb://localhost:27017/<databaseName>
    set PORT=3000
    ```

## Usage

1. Start the server:

    ```bash
    node index.js
    ```

2. The API will be running on `http://localhost:3000`.

## API Endpoints

### `GET /`

Returns a welcome message when you make a request with  http://localhost:3000.
**Response:**
```json
"Hello, this is the Bitespeed Backend API!"
![image](https://github.com/AmanMalviya22/bitespeed-backend/assets/94959490/44e35fe8-a374-4142-b752-cce2bc7076e7)


 Make a request on postman with url http://localhost:3000/identify  and set response body in below format.
 {
"email":"<your email>",
"phoneNumber": "<your phone no>"
}

**Response:**
![image](https://github.com/AmanMalviya22/bitespeed-backend/assets/94959490/3269cdd7-52e7-40c2-b159-a54247d4a60e)

