const connection = require("../server");
const { dbHelper } = require("../helpers");
const userService = require("./user.service");

module.exports = {
  Post: (data, userid, requestedPostId) => {
    return {
      data,
      errors: [],
      userid,
      requestedPostId
    };
  },

  cleanUp: function () {
    if (typeof this.data.title != "string") {
      this.data.title = "";
    }
    if (typeof this.data.body != "string") {
      this.data.body = "";
    }

    const leadingZero = (x) => {
      return x < 10 ? "0" + x : x;
    };

    let date = new Date();
    let day = leadingZero(date.getDate());
    let hours = leadingZero(date.getHours());
    let minutes = leadingZero(date.getMinutes());
    let seconds = leadingZero(date.getSeconds());
    let month = leadingZero(date.getMonth() + 1);
    const fullDate = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    this.data = {
      title: sanitizeHTML(this.data.title.trim(), { allowedTags: [], allowedAttributes: {} }),
      body: sanitizeHTML(this.data.body.trim(), { allowedTags: [], allowedAttributes: {} }),
      createdDate: fullDate,
      author: this.userid
    };
  },

  validate: function () {
    if (this.data.title == "") {
      this.errors.push("You must provide a title.");
    }
    if (this.data.body == "") {
      this.errors.push("You must provide post content.");
    }
  },

  create: function () {
    return new Promise(async (resolve, reject) => {
      this.cleanUp();
      this.validate();
      if (!this.errors.length) {
        const incoming = {
          title: this.data.title,
          body: this.data.body,
          createdDate: this.data.createdDate,
          author: this.data.author
        };
        /*===============================================
        Task #1 CREATE A POST
        You'll need: incoming.title, incoming.body, incoming.author, and incoming.createdDate
        ===============================================*/
        const [{ insertId }] = await db.execute("INSERT INTO posts (title, body, author, createdDate) VALUES(?, ?, ?, ?)", [incoming.title, incoming.body, incoming.author, incoming.createdDate]);
        resolve(insertId);
      } else {
        reject(this.errors);
      }
    });
  },

  update: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let post = await this.findSingleById(this.requestedPostId, this.userid);
        if (post.isVisitorOwner) {
          // actually update the db
          let status = await this.actuallyUpdate();
          resolve(status);
        } else {
          reject();
        }
      } catch {
        reject();
      }
    });
  },

  actuallyUpdate: function () {
    return new Promise(async (resolve, reject) => {
      this.cleanUp();
      this.validate();
      if (!this.errors.length) {
        const incoming = {
          title: this.data.title,
          body: this.data.body,
          requestedPostId: this.requestedPostId
        };
        /*===============================================
        Task #2 UPDATE AN EXISTING POST
        You'll need: incoming.title, incoming.body, incoming.requestedPostId
        ===============================================*/
        await db.execute("UPDATE posts SET title = ?, body = ? WHERE _id = ?", [incoming.title, incoming.body, incoming.requestedPostId]);
        resolve("success");
      } else {
        resolve("failure");
      }
    });
  },

  findSingleById: async (id, visitorId = 0) => {
    return new Promise(async (resolve, reject) => {
      /*===============================================
      Task #3 FIND ONE POST BY ID
      You'll need: id
      ===============================================*/
      let [[post]] = await db.execute("SELECT p.title, p.body, p._id, p.author, p.createdDate, u.username, u.avatar FROM posts p JOIN users u ON p.author = u._id WHERE p._id = ?", [id]);

      if (post) {
        post.isVisitorOwner = post.author == visitorId;
        resolve(post);
      } else {
        reject();
      }
    });
  },

  findByAuthorId: async (authorId) => {
    /*===============================================
    Task #4 FIND ALL POSTS BY AUTHOR ID
    You'll need: authorId
    ===============================================*/
    let [posts] = await db.execute("SELECT p.title, p.body, p._id, p.author, p.createdDate, u.username, u.avatar FROM posts p JOIN users u ON p.author = u._id WHERE p.author = ? ORDER BY createdDate DESC", [authorId]);
    return posts;
  },

  countCommentsByAuthor: async (id) => {
    return new Promise(async (resolve, reject) => {
      /*===============================================
      Task #5 COUNT HOW MANY POSTS A USER HAS CREATED
      You'll need: id
      ===============================================*/
      const [[{ posts }]] = await db.execute("SELECT count(_id) as posts FROM posts WHERE author = ?", [id]);
      resolve(posts);
    });
  },

  deleteComment: async (postIdToDelete, currentUserId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let post = await this.findSingleById(postIdToDelete, currentUserId);
        if (post.isVisitorOwner) {
          /*===============================================
          Task #6 DELETE ONE POST BY ID,
          You'll need: postIdToDelete
          ===============================================*/
          await db.execute("DELETE FROM posts WHERE _id = ?", [postIdToDelete]);
          resolve();
        } else {
          reject();
        }
      } catch {
        reject();
      }
    });
  },

  commentSearch: async (searchTerm) => {
    return new Promise(async (resolve, reject) => {
      if (typeof searchTerm == "string") {
        /*===============================================
        Task #7 SEARCH FOR POSTS BY KEYWORD OR PHRASE
        You'll need: searchTerm
        ===============================================*/
        let [posts] = await db.execute("SELECT p.title, p.body, p._id, p.author, p.createdDate, u.username, u.avatar FROM posts p JOIN users u ON p.author = u._id WHERE MATCH(title, body) AGAINST(?)", [searchTerm]);
        resolve(posts);
      } else {
        reject();
      }
    });
  },

  getCommentFeed: async (id) => {
    /*===============================================
    Task #8 GET POSTS FROM USERS YOU FOLLOW
    You'll need: id
    ===============================================*/
    let [posts] = await db.execute("SELECT posts._id, title, createdDate, username, avatar FROM posts JOIN users ON posts.author = users._id WHERE author IN (SELECT followedId FROM follows WHERE authorId = ?) ORDER BY createdDate DESC", [id]);

    // Return 'posts' instead of [] once you've actually written your query.
    return posts;
  }
};
