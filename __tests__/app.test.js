const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200 responds with a array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("any method: handles all bad paths", () => {
  test("404: responds with bad request for invalid endpoint", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/", () => {
  test("200: responds with an object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty(["GET /api"], expect.any(Object));
        expect(body).toHaveProperty(["GET /api/topics"], expect.any(Object));
        expect(body).toHaveProperty(["GET /api/articles"], expect.any(Object));
        expect(body).toEqual(endpoints);
      });
  });
});
