'use strict';

const sinon          = require('sinon');
const chai           = require('chai');
const expect         = chai.expect;
const proxyquire     = require('proxyquire').noPreserveCache();

chai.use(require('sinon-chai'));

let mocks,
    api

const getTestedModule = function getTestedModule(mocks) {
  return proxyquire('./api', mocks);
};

describe("api:", () => {
  let requestMock = sinon.stub();
  requestMock.defaults = sinon.stub();

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
        url: 'https://marlowe.relinklabs.com'
      };

      let defaults = {
        headers: {
          Authorization: 'Bearer foobar'
        }
      };

      result = {};
      requestMock.returns(Promise.resolve(result));
      requestMock.defaults.returns(requestMock);
    });

    afterEach(() => {
      requestMock.reset();
    });

    it('should default to perform a GET request to the host', () => {
      return api.makeRequest(options)
        .then((result) => {
          expect(result).to.deep.equal({});
          expect(requestMock.calledOnce).to.be.true;
          expect(requestMock.calledWith({
            url: 'https://marlowe.relinklabs.com',
            method: 'GET'
          })).to.be.true;
        });
    });

    it('should be able to make POST, PUT and DELETE requests', () => {
      options.method = 'POST'

      return api.makeRequest(options)
        .then((result) => {
          expect(result).to.deep.equal({});
          expect(requestMock.calledOnce).to.be.true;
          expect(requestMock.calledWith({
            url: 'https://marlowe.relinklabs.com',
            method: 'POST'
          })).to.be.true;
        });
    });
  });


  describe("setDefaults:", () => {

    let options;

    beforeEach(() => {
      options = {
        baseUrl: 'https://marlowe.relinklabs.com'
      };

      requestMock.defaults.returns('foo');
    });

    afterEach(() => {
      requestMock.defaults.reset();
    });

    it('should call the request library "setDefaults" method', () => {
      api.setDefaults(options);
      expect(requestMock.defaults.calledWith(options)).to.be.true;
      expect(api.baseRequest).to.equal('foo');
    });
  });
});
