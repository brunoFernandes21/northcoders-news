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

describe("GET /api/articles/:article_id", () => {
  test("200: accepts an article_id parameter and should respond with an article with only the article with that id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: should respond with Bad request when article_id is an invalid type", () => {
    return request(app)
    .get("/api/articles/apples")
    .expect(400)
    .then(( { body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
  test("404: should respond with a Not found msg when provided a valid article_id that does not exist", () => {
    return request(app)
    .get("/api/articles/99999")
    .expect(404)
    .then(( { body }) => {
      expect(body.msg).toBe("Not found")
    })
  })
});
