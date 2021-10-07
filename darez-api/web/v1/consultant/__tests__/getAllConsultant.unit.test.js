const { getAllConsultant } = require('../getAllConsultant');

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: consultant - getAllConsultant', () => {
  it('when I use getAllConsultant should return a list of all available consultants', async () => {
    const response = await getAllConsultant();

    expect(response).toEqual({
      statusCode: 200,
      data: {
        consultant: ['Elizene Ribeiro Silva', 'Gabriela P5', 'Leonardo Scetta Dias', 'Siranny',
          'Marylia Nunes dos Santos', 'Ana Paula Lima da Silva', 'Alyson Luiz e Silva', 'Dev Team',
          'Tiago Pereira Rodrigues ', 'Denis Lacerda de Sousa', 'Henrique sabelli Sampaio',
          'Renata Oliveira de Sousa', 'Samuel Rogério dos Santos', 'Samantha Gonçalves Oliveira',
          'Lucas Santana da Rocha', 'Johnny', 'Valmir dos Santos Avelino', 'Alisson Augusto Dias Domingues',
          'Keilla Olmo Speridão', 'Giovanne Alves Pereira', 'App Store Team', 'Stefanie Lacerda', 'Vinicius',
          'Pedro P2', 'Ellen Cristina Borges de Souza', 'Angela P3', 'Carlos P1', 'André da Silva Ferreira',
          'Ian Zanatto Cinelli', 'Gabriel Ferreira de Souza Chagas', 'Moacir P6', 'Barezy', 'Ruan Virginio Barreto Valentim',
          'Joana P4', 'Ana Cristina Gonçalves da Silva Isidio'],
      },
    });
  });
});
