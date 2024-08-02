// src/mocks/axiosMock.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockData } from './sharesMock';

const mock = new MockAdapter(axios, { delayResponse: 500 });

mock.onGet('/api/shares-details/VUE').reply(200, mockData.companyDetails);
mock.onGet('/api/shares-metrics').reply(200, mockData.cryptoMetrics);
mock.onGet('/api/search').reply((config) => {
  const query = config.params.query.toLowerCase();
  const filtered = mockData.searchSuggestions.filter((item) =>
    item.name.toLowerCase().includes(query)
  );
  return [200, filtered];
});

export default mock;
