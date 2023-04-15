/// <reference types= "cypress" />

import contrato from '../contratos/produtos.contracts'

describe('Testes da funcionalidade Produtos', () => {

    let token 

before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn})
});


it('Deve validar contrato de Produtos', () => {
    cy.request('produtos').then(response => {
        return contrato.validateAsync(response.body)

    })
});


    it('Listar produtos', () => {
            
        cy.request({

            method: 'GET',
            url: 'Produtos'
        }).then((response) => {
            //expect(response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(60)
        })

    });

    it('Cadastrar produto', () => {

        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`

        cy.request({
        method: 'POST',
        url: 'Produtos',
        body:     {
            "nome": produto,
            "preco": 300,
            "descricao": "Produto novo",
            "quantidade": 100
          },
          headers: {authorization: token}

        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')


        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        
        cy.cadastrarProduto(token, 'Produto EBAC', 250, 'Descriçao do produto novo', 180 )
        
        .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
    
    
            })

    });

    it('Deve editar um produto ja cadastrado', () => {
        cy.request('produtos').then(response => {
            let id =  response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `Produtos/${id}`,
                headers: {authorization:token},
                body: {
                        "nome": "Produto editado ",
                        "preco": 100,
                        "descricao": "Produto editado",
                        "quantidade": 100
                      }

            }).then(response => {
             expect(response.body.message).to.equal('Registro alterado com sucesso')

            })
        })
    });

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarProduto(token, produto , 250, 'Descriçao do produto novo', 180 )
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT',
                url: `Produtos/${id}`,
                headers: {authorization:token},
                body: {
                        "nome": produto,
                        "preco": 200,
                        "descricao": "Produto editado",
                        "quantidade": 300
                      }

            }).then(response => {
             expect(response.body.message).to.equal('Registro alterado com sucesso')

            })
        })

    });

    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarProduto(token, produto , 250, 'Descriçao do produto novo', 180 )
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `Produtos/${id}`,
                headers: {authorization:token},
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })

        })
    });
   
});


