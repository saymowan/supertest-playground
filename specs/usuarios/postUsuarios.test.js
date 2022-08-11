let request = require('supertest');
const Joi = require('joi');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const Chance = require('chance');
const chance = new Chance();

request = request('http://localhost:3000');

describe('Post Usuarios', async() =>{
    let regularUserBody;
    let userId;
    let responsePostUsuario;

    before(async()=>{

        regularUserBody = {
            'nome': chance.name({ nationality: 'en', middle_initial: true }),
            'email': chance.email({domain: 'qa.com.br'}),
            'password': chance.word({ syllables: 5 }),
            'administrador': 'false'
          }

        responsePostUsuario = await request
                                        .post('/usuarios')
                                        .send(regularUserBody)
                                        .set('Accept', 'application/json; charset=utf-8');
        
        expect(responsePostUsuario.status).to.be.eql(201);
        regularUserBody._id = responsePostUsuario.body._id;
        userId = responsePostUsuario.body._id;
    })

    it('Should insert a new user', async() => {

        expect(responsePostUsuario.body.message).to.be.eql('Cadastro realizado com sucesso');
        assert.isDefined(responsePostUsuario.body._id);
    })

    it('Should duplicate the new user', async() => {
        var regularUserBodyLocal = JSON.parse(JSON.stringify(regularUserBody));
        delete regularUserBodyLocal._id;
        let responsePostUsuario = await request
                                    .post('/usuarios')
                                    .send(regularUserBodyLocal)
                                    .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostUsuario.status).to.be.eql(400);
        expect(responsePostUsuario.body.message).to.be.eql('Este email já está sendo usado');
    })

    it('Should validate missing password attribute', async() => {
        let wrongUserJsonBody = {
            'nome': chance.name({ nationality: 'en', middle_initial: true }),
            'email': chance.email({domain: 'qa.com.br'}),
            'administrador': 'false'
          }

        let responsePostUsuario = await request
                                    .post('/usuarios')
                                    .send(wrongUserJsonBody)
                                    .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostUsuario.status).to.be.eql(400);
        expect(responsePostUsuario.body.password).to.be.eql('password é obrigatório');
    })

    it('Should validate missing email attribute', async() => {
        let wrongUserJsonBody = {
            'nome': chance.name({ nationality: 'en', middle_initial: true }),
            'password': chance.word({ syllables: 5 }),
            'administrador': 'false'
          }

        let responsePostUsuario = await request
                                    .post('/usuarios')
                                    .send(wrongUserJsonBody)
                                    .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostUsuario.status).to.be.eql(400);
        expect(responsePostUsuario.body.email).to.be.eql('email é obrigatório');
    })

    it('Should validate missing email attribute', async() => {
        let wrongUserJsonBody = {
            'email': chance.email({domain: 'qa.com.br'}),
            'password': chance.word({ syllables: 5 }),
            'administrador': 'false'
          }

        let responsePostUsuario = await request
                                    .post('/usuarios')
                                    .send(wrongUserJsonBody)
                                    .set('Accept', 'application/json; charset=utf-8');

        expect(responsePostUsuario.status).to.be.eql(400);
        expect(responsePostUsuario.body.nome).to.be.eql('nome é obrigatório');
    })

    it('Should search the new inserted user', async() => {
        responseGetUser = (await request
                                  .get('/usuarios')
                                  .query({ _id: `${userId}` })
                                  .set('Accept', 'application/json; charset=utf-8')
                                  .expect(200)).body.usuarios[0];

        expect(responseGetUser).to.deep.eq(regularUserBody);
    })

})