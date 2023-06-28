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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should respond with the newly posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is an article that is worth reading"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(( { body }) => {
      const { comment } = body
      expect(comment.comment_id).toBe(19)
      expect(comment.body).toBe("This is an article that is worth reading")
      expect(comment.article_id).toBe(1)
      expect(comment.author).toBe("butter_bridge")
      expect(comment.votes).toBe(0)
      expect(comment).toHaveProperty("created_at", expect.any(String))  
    })
  })
  test("400: should respond with a error message when missing required fields", () => {
    const newComment = {}
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })
})
