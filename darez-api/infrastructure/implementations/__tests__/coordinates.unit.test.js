const coordinates = require('../coordinates');
const { geocoder } = require('../../adapters/maps');

jest.mock('../../adapters/maps');

describe('Unit Test: Coordinates Implementation', () => {
  it('when I call coordinates calculation return a specific coordinate', async () => {
    geocoder.geocode.mockImplementation(() => [{ latitude: 10.000001, longitude: 20.100001 }]);
    const { latitude, longitude } = await coordinates({
      streetNumber: 200,
      street: 'Street',
      city: 'City',
      state: 'State',
      cep: '01234567',
    });
    expect(latitude).toBe(10.000001);
    expect(longitude).toBe(20.100001);
  });

  it('when I call coordinates calculation and have some error then should throw an exception', async () => {
    geocoder.geocode.mockImplementation(() => {
      throw new Error('Some error');
    });
    try {
      await coordinates({
        streetNumber: 200,
        street: 'Street',
        city: 'City',
        state: 'State',
        cep: '01234567',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });
});
