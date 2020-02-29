import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import localStorage from 'localStorage';
import app from '../../app';
import { requesterCredentials } from './credentials';

chai.use(chaiHttp);
chai.should();

const asManager = () => {
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
    it('should return 400 when no inputs were provided ', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/edit/request/${4}`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.erroMessage).to.equal('You are sending empty fields');
          done();
        });
    });
  });
};

export default asManager;
