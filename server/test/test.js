import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/server.js";

chai.use(chaiHttp);
chai.should();

describe("API tests", () => {
  describe("GET /api/files/list", () => {
    it("should return a list of files", (done) => {
      chai
        .request(app)
        .get("/api/files/list")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("GET /api/files/data", () => {
    it("should return file data", (done) => {
      chai
        .request(app)
        .get("/api/files/data")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.forEach((file) => {
            file.should.have.property("file");
            file.should.have.property("lines");
            file.lines.should.be.an("array");
          });
          done();
        });
    });

    it("should return file data for a specific file if filename query parameter is provided", (done) => {
      chai
        .request(app)
        .get("/api/files/data?filename=test3.csv")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.equal(1);
          res.body[0].should.have.property("file", "test3.csv");
          res.body[0].should.have.property("lines");
          res.body[0].lines.should.be.an("array");
          done();
        });
    });

  });
});
