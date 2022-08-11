let request = require('supertest');
const Joi = require('joi');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const environmentsUtils = require('../../utils/environmentsUtils')
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const TARGET_ENV = args.env || 'production';
request = request(environmentsUtils[TARGET_ENV].home);


describe(' ',async()=>{

    it(' ', async()=>{


    })

})