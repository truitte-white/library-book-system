const connection = require("../server");
const { dbHelper } = require("../helpers");
const userService = require("./user.service");

module.exports = {
  Post: (data, UserId, requestedCommentId) => {
    return {
      data,
      errors: [],
      UserId,
      requestedCommentId
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
      author: this.UserId
    };
  },

  validate: function () {
    if (this.data.title == "") {
      this.errors.push("You must provide a title.");
    }
    if (this.data.body == "") {
      this.errors.push("You must provide comment content.");
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
        Task #1 CREATE A COMMENT
        You'll need: incoming.title, incoming.body, incoming.author, and incoming.createdDate
        ===============================================*/
        const [{ insertId }] = await db.execute("INSERT INTO bookscomments (title, body, author, createdDate) VALUES(?, ?, ?, ?)", [incoming.title, incoming.body, incoming.author, incoming.createdDate]);
        resolve(insertId);
      } else {
        reject(this.errors);
      }
    });
  },

  update: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let comment = await this.findSingleById(this.requestedcommentId, this.UserId);
        if (comment.isVisitorOwner) {
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
          requestedCommentId: this.requestedCommentIdd
        };
        /*===============================================
        Task #2 UPDATE AN EXISTING COMMENT
        You'll need: incoming.title, incoming.body, incoming.requestedCommentId
        ===============================================*/
        await db.execute("UPDATE bookscomments SET title = ?, body = ? WHERE _id = ?", [incoming.title, incoming.body, incoming.requestedCommentId]);
        resolve("success");
      } else {
        resolve("failure");
      }
    });
  },

  findSingleById: async (id, visitorId = 0) => {
    return new Promise(async (resolve, reject) => {
      /*===============================================
      Task #3 FIND ONE COMMENT BY ID
      You'll need: id
      ===============================================*/
      let [[comment]] = await db.execute("SELECT p.title, p.body, p._id, p.author, p.createdDate, u.username, u.avatar FROM bookscomments p JOIN users u ON p.author = u._id WHERE p._id = ?", [id]);

      if (comment) {
        comment.isVisitorOwner = comment.author == visitorId;
        resolve(comment);
      } else {
        reject();
      }
    });
  },

  findByAuthorId: async (authorId) => {
    /*===============================================
    Task #4 FIND ALL COMMENTS BY AUTHOR ID
    You'll need: authorId
    ===============================================*/
    let [comments] = await db.execute("SELECT p.title, p.body, p._id, p.author, p.createdDate, u.username, u.avatar FROM bookscomments p JOIN users u ON p.author = u._id WHERE p.author = ? ORDER BY createdDate DESC", [authorId]);
    return comments;
  },

  countCommentsByAuthor: async (id) => {
    return new Promise(async (resolve, reject) => {
      /*===============================================
      Task #5 COUNT HOW MANY COMMENTS A USER HAS CREATED
      You'll need: id
      ===============================================*/
      const [[{ comments }]] = await db.execute("SELECT count(_id) as comments FROM bookscomments WHERE author = ?", [id]);
      resolve(comments);
    });
  },

  deleteComment: async (commentIdToDelete, currentUserId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let comment = await this.findSingleById(commentIdToDelete, currentUserId);
        if (comment.isVisitorOwner) {
          /*===============================================
          Task #6 DELETE ONE COMMENT BY ID,
          You'll need: commentIdToDelete
          ===============================================*/
          await db.execute("DELETE FROM bookscomments WHERE _id = ?", [commentIdToDelete]);
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
        Task #7 SEARCH FOR COMMENTS BY KEYWORD OR PHRASE
        You'll need: searchTerm
        ===============================================*/
        let [comments] = await db.execute("SELECT p.title, p.body, p._id, p.author, p.createdDate, u.username, u.avatar FROM bookscomments p JOIN users u ON p.author = u._id WHERE MATCH(title, body) AGAINST(?)", [searchTerm]);
        resolve(comments);
      } else {
        reject();
      }
    });
  },

  getCommentFeed: async (id) => {
    /*===============================================
    Task #8 GET COMMENTS FROM USERS YOU FOLLOW
    You'll need: id
    ===============================================*/
    let [comments] = await db.execute("SELECT bookscomments._id, title, createdDate, username, avatar FROM bookscomments JOIN users ON bookscomments.UserId  = users._id WHERE author IN (SELECT followedId FROM follows WHERE authorId = ?) ORDER BY createdDate DESC", [id]);

    // Return 'comments' instead of [] once you've actually written your query.
    return comments;
  }
};
