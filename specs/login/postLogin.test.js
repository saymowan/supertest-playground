let request = require('supertest');
const Joi = require('joi');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const Chance = require('chance');
const chance = new Chance();
const environmentsUtils = require('../../utils/environmentsUtils')
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const TARGET_ENV = args.env || 'production';
request = request(environmentsUtils[TARGET_ENV].home);


describe("Post Login", async() => {

    it(`Should not login with invalid credentials`, async()=>{

        let invalidCredentials = {
            'email': chance.email({domain: 'qa.com.br'}),
            'password': chance.word({ syllables: 5 })
          }

        const responsePostLogin = await request
                                .post(`/login`)
                                .send(invalidCredentials)
                                .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostLogin.status).to.eql(401); 

    })

    it(`Should login with valid administrator credentials`, async()=>{

        let responseGetUsuarios = await request
                .get('/usuarios?administrador=true')
                .set('Accept', 'application/json; charset=utf-8');

        expect(responseGetUsuarios.status).to.eql(200);

        let validAdmCredentials = {
            'email': responseGetUsuarios.body.usuarios[0].email,
            'password': responseGetUsuarios.body.usuarios[0].password
          }

        const responsePostLogin = await request
                                    .post(`/login`)
                                    .send(validAdmCredentials)
                                    .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostLogin.status).to.eql(200);
        expect(responsePostLogin.body.message).to.eql("Login realizado com sucesso");
        expect(responsePostLogin.body.authorization).to.contains("Bearer");
    })


    it(`Should login with valid non-administrator credentials`, async()=>{

        let responseGetUsuarios = await request
                .get('/usuarios?administrador=false')
                .set('Accept', 'application/json; charset=utf-8');

        expect(responseGetUsuarios.status).to.eql(200);

        let validAdmCredentials = {
            'email': responseGetUsuarios.body.usuarios[0].email,
            'password': responseGetUsuarios.body.usuarios[0].password
          }

        const responsePostLogin = await request
                                    .post(`/login`)
                                    .send(validAdmCredentials)
                                    .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostLogin.status).to.eql(200);
        expect(responsePostLogin.body.message).to.eql("Login realizado com sucesso");
        expect(responsePostLogin.body.authorization).to.contains("Bearer");
    })





})