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

describe('Get Usuarios', async() => {

  let responseGetUsuarios;

  before(async() => {
    responseGetUsuarios = await request
                                  .get('/usuarios')
                                  .set('Accept', 'application/json; charset=utf-8')
  })

  it(`Should validate status code 200`, async() => {
    expect(responseGetUsuarios.status).to.eql(200); 
  });

  it('Should validate the defined objects', async() => {
    assert.isDefined(responseGetUsuarios.body.quantidade);
    assert.isNumber(responseGetUsuarios.body.quantidade);
    assert.isDefined(responseGetUsuarios.body.usuarios);
    assert.isArray(responseGetUsuarios.body.usuarios);
  });

  it('Should validate the defined data', async() => {
    expect(responseGetUsuarios.body.quantidade).to.be.above(0);
    expect(responseGetUsuarios.body.usuarios).to.have.lengthOf.above(0);
  });

  it('Should validate the schema', async() => {

    const schema = Joi.object().keys({
      quantidade: Joi.number(),
      usuarios: Joi.array().items({
        nome: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        administrador: Joi.boolean(),
        _id: Joi.string()
      })
    })

    Joi.assert(responseGetUsuarios.body, schema)     
  });

  it('Should validate current administrator data', async() =>{
    const filterAdministrador = responseGetUsuarios.body.usuarios.filter(object=>object.administrador==='true');
    expect(filterAdministrador[0].nome).to.be.eql('Fulano da Silva');
    expect(filterAdministrador[0].email).to.be.eql('fulano@qa.com');
    expect(filterAdministrador[0].password).to.be.eql('teste');
    expect(filterAdministrador[0].administrador).to.be.eql('true');
  });

});