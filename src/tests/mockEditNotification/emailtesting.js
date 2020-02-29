import chai, { expect } from 'chai';
import { mockResponse } from 'mock-req-res';

import { editEventHandler } from '../../events/editEvent';

const eventEmail = () => {
  describe('Edit notification ', () => {
    it(' Test email notification ', (done) => {
      const data = {
        userId: 7,
        managerId: 6,
        title: 'request reson',
        id: 4,
        res: mockResponse()
      };
      expect(editEventHandler(data)).to.be.ok;
      done();
    });
  });
};

export default eventEmail;
