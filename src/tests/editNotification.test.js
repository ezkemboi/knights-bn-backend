import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import localStorage from 'localStorage';
import app from '../app';
import { requesterCredentials } from './mockEditNotification/credentials';

chai.use(chaiHttp);
chai.should();

const editNotification = () => {
  describe('Edit notification ', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(requesterCredentials)
        .end((err, res) => {
          localStorage.setItem('token', res.body.token);
          done();
        });
    });

    afterEach((done) => {
      localStorage.clear();
      done();
    });

    it('should return 200 when editing done by owner ', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/edit/request/${4}`)
        .send({
          reason: 'research',
          destination: 'kibuye'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
};

export default editNotification;
