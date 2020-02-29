import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import localStorage from 'localStorage';
import app from '../../app';
import { wrongPerson } from '../mockEditNotification/credentials';

chai.use(chaiHttp);
chai.should();

const notOwner = () => {
  describe('Edit notification ', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(wrongPerson)
        .end((err, res) => {
          localStorage.setItem('token', res.body.token);
          done();
        });
    });

    afterEach((done) => {
      localStorage.clear();
      done();
    });
    it('should return 401 ', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/edit/request/${4}`)
        .send({
          reason: 'research',
          destination: 'kibuye'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.erroMessage).to.equal('You are not authorized to access this information');
          done();
        });
    });
  });
};

export default notOwner;
