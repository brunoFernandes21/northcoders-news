const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
require("jest-sorted");

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
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
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
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with a Not found msg when provided a valid article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("votes", expect.any(Number));
        });
      });
  });
  test("200: should respond with an empty array if article_id exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
      });
  });
  test("404: should respond with Not Found when article_id is valid but does not exists", () => {
    return request(app)
      .get("/api/articles/99999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: should respond with Bad request message when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/strawberries/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should respond with the newly posted comment when only the required properties are present", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is an article that is worth reading",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("This is an article that is worth reading");
        expect(comment.article_id).toBe(1);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("201: respond with correct object when comment has extra properties as well as the required ones", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a must-have book",
      year: "28-06-2023",
      favFruit: "Strawberries",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("This is a must-have book");
        expect(comment.article_id).toBe(1);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("400: should respond with a error message when missing required fields", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("400: should respond with a error message when article id is invalid type", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is an article that is worth reading",
    };
    return request(app)
      .post("/api/articles/apples/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with a error message when article id is valid but does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is an article that is worth reading",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("404: should respond with an error message when username does not exist", () => {
    const newComment = {
      username: "bruno_fernandes",
      body: "This is an article that is worth reading",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should respond with the updated article with votes property incremented or decremented or the same based on the inc_votes value", () => {
    const newVote = { inc_votes: 25 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article.votes).toBe(125);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("400: should respond with a error message when inc_votes is an invalid type", () => {
    const newVote = { inc_votes: "Banana" };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: should respond with error message when id is invalid", () => {
    const newVote = { inc_votes: 1}

    return request(app)
    .patch("/api/articles/orange")
    .send(newVote)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request")
    })
  })

  test("404: should respond with error message when id is valid but does not exist in the db", () => {
    const newVote = { inc_votes: 1}

    return request(app)
    .patch("/api/articles/9999999")
    .send(newVote)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found")
    })
  })

});

describe("any methods: handles all bad paths", () => {
  test("404: responds with not found for any invalid path", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should respond with message no content", () => {
    return request(app)
    .delete("/api/comments/")
  })
})
