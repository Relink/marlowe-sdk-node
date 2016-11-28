# Relink Marlowe Node.js SDK

*Node.js SDK to work with the [Marlowe API](https://docs.relinklabs.com/marlowe/ "Marlowe API documentation")*

This library is a simple wrapper around the [Marlowe API](https://docs.relinklabs.com/marlowe/ "Marlowe API documentation"). It is a collection of methods that let you authenticate with the API, then create, read, update and delete resources in the REST API, without having to make HTTP calls within your own code.

**Please note that in order to use the API, you need to be a Relink partner and have access to the resources provided by Relink!**

*For more information on how to become a Relink partner, please visit the [Relink homepage](https://relinklabs.com/) or send an email to <hello@relinklabs.com>.*

## Install

```bash
npm install relink-marlowe
```

## Documentation
To see a full list REST API resources, please visit the [Marlowe API documentation](https://docs.relinklabs.com/marlowe/ "Marlowe API documentation").

This SDK is fully documented with JsDoc. A Live version of the documentation can be found here: [Marlowe Node.js SDK documentation](https://docs.relinklabs.com/sdk/marlowe/nodejs/ "Marlowe Node.js SDK documentation").

You can build the documentation by running `npm run docs`.

## Usage

Everything starts with a `Client` instance, which you create like so:

```javascript

let marlowe = require('relink-marlowe');

// it is good practice to provide the API key and secret through environment variables
let client = new marlowe.Client();
```

If you have the `RELINK_API_KEY` and `RELINK_API_SECRET` environment variables 
set, the SDK will automatically use those values. You can also pass this in as 
an object to the `Client` instance like this: 

```javascript

let marlowe = require('relink-marlowe');

// it is good practice to provide the API key and secret through environment variables
let client = new marlowe.Client({
  apiKey: 'your api key', 
  apiSecret: 'your api secret'
});
```

With a `Client` instance, you can perform all operations listed in the [documentation](https://docs.relinklabs.com/marlowe/ "Marlowe API documentation").

```javascript
// Create a new analysis based on a candidate profile data

// must be a valid job id created with the `createJob` method in this SDK
let jobId = 'foo bar';

// please see the documentation page for more info about this object
let data = {}; 

return client.createAnalysis(jobId, data)
  .then((result) => {
    console.log(result);
  });
```

## Support

We're here to help if you get stuck.  There are several ways that you an get in
touch with a member of our team:

* Send an email to <support@relinklabs.com>
* Open a Github Issue [here](https://github.com/Relink/marlowe-sdk-node/issues).