'use strict';

const sinon          = require('sinon');
const chai           = require('chai');
const expect         = chai.expect;
const proxyquire     = require('proxyquire');

chai.use(require('sinon-chai'));

let mocks,
    api

const getTestedModule = function getTestedModule(mocks) {
  return proxyquire('./api', mocks);
};

describe("api:", () => {
  let requestMock = sinon.stub();

  before(() => {
    mocks = {
      'request-promise': requestMock
    };

    api = getTestedModule(mocks);
  });

  describe("makeRequest:", () => {

    let options,
        result;

    beforeEach(() => {
      options = {
        uri: 'https://marlowe.relinklabs.com'
      };

      result = {};
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should default top perform a GET request to the host', () => {
      requestMock.returns(Promise.resolve(result));

      return api.makeRequest(options)
        .then((result) => {
          expect(result).to.deep.equal({});
          expect(requestMock.calledOnce).to.be.true;
          expect(requestMock.calledWith({
            uri: 'https://marlowe.relinklabs.com',
            method: 'GET'
          })).to.be.true;
        });
    });

    it('should be able to make POST, PUT and DELETE requests', () => {
      requestMock.returns(Promise.resolve(result));

      options.method = 'POST'

      return api.makeRequest(options)
        .then((result) => {
          expect(result).to.deep.equal({});
          expect(requestMock.calledOnce).to.be.true;
          expect(requestMock.calledWith({
            uri: 'https://marlowe.relinklabs.com',
            method: 'POST'
          })).to.be.true;
        });
    });

  });
});
