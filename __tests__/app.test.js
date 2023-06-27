const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
require('jest-sorted');

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
  test("404: responds with bad request for invalid path", () => {
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
        expect(body).toMatchObject(endpoints);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body
      expect(articles).toHaveLength(13)
      expect(articles).toBeSortedBy("created_at", { descending: true })
      articles.forEach((article) => {
        expect(article).toHaveProperty("author", expect.any(String))
        expect(article).toHaveProperty("title", expect.any(String))
        expect(article).toHaveProperty("article_id", expect.any(Number))
        expect(article).toHaveProperty("topic", expect.any(String))
        expect(article).toHaveProperty("created_at", expect.any(String))
        expect(article).toHaveProperty("votes", expect.any(Number))
        expect(article).toHaveProperty("article_img_url", expect.any(String))
        expect(article).toHaveProperty("comment_count", expect.any(Number))
      })
    })
  })
})

describe("handles all bad paths", () => {
  test("404: should respond with a bad request message", () => {
    return request(app)
    .get("/api/apples")
    .expect(404)
    .then(( { body }) => {
      expect(body.msg).toBe("Not Found")
    })
  })
})
