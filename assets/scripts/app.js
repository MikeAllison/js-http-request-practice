class HTTPRequest {
  constructor(type, url, responseType, data) {
    this.type = type;
    this.url = url;
    this.responseType = responseType;
    this.data = data;
  }

  execute() {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      
      if (this.responseType) { 
        req.responseType = this.responseType;
      };

      req.open(this.type, this.url);
      req.onload = () => resolve(req.response);
      req.onerror = () => reject(req);
      req.send(JSON.stringify(this.data));
    });
  }
}

class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
}

class Form {
  constructor(renderHook, postSectionHook) {
    this.renderHook = renderHook;
    this.postSectionHook = postSectionHook;
  }

  init() {
    const addPostBtn = document.querySelector(`#${this.renderHook} button`);

    addPostBtn.addEventListener('click', (event) => {
      event.preventDefault();
      
      const titleInput = document.querySelector(`#${this.renderHook} #title`);
      const bodyInput = document.querySelector(`#${this.renderHook} #body`);

      const reqData = {
        title: titleInput.value,
        body: bodyInput.value
      };
      
      const req = new HTTPRequest('POST', 'https://jsonplaceholder.typicode.com/posts', null, reqData);

      req.execute()
        .then(response => {
          const post = new Post(titleInput.value, bodyInput.value);
          const postItem = new PostItem(this.renderHook, post);
          const postUl = document.querySelector(`#${this.postSectionHook} .posts`);
          
          postUl.prepend(postItem.render());
          titleInput.value = null;
          bodyInput.value = null;
        })
        .catch(() => {
          console.log('There was a problem submitting the post.');
        });
    });
  }
}

class PostSection {
  constructor(renderHook) {
    this.renderHook = renderHook;
  }

  init() {
    const fetchPostsBtn = document.querySelector(`#${this.renderHook} button`);

    fetchPostsBtn.addEventListener('click', () => {
      const req = new HTTPRequest('GET', 'https://jsonplaceholder.typicode.com/posts', 'json');

      req.execute()
        .then(response => {
          const posts = [];

          response.forEach(post => {
            posts.push(post);
          });

          document.querySelectorAll(`#${this.renderHook} li`).forEach(li => {
            li.remove();
          });

          new PostList(this.renderHook, posts).render();
        })
        .catch(() => {
          console.log('Could not load posts');
        });
    });
  }
}

class PostList {
  constructor(renderHook, posts) {
    this.renderHook = renderHook;
    this.posts = posts;
    this.postUl = document.querySelector(`#${this.renderHook} .posts`);
  }

  add(postLi) {
    this.postUl.prepend(postLi);
  }

  render() {
    this.posts.forEach(post => {
      const postLi = new PostItem(this.renderHook, post).render();
      this.postUl.append(postLi);
    });
  }
}

class PostItem {
  constructor(renderHook, post) {
    this.renderHook = renderHook;
    this.title = post.title;
    this.body = post.body;
  }

  render() {
    const postLi = document.createElement('li');
    postLi.classList.add('post-item');
    postLi.innerHTML = `
      <h2>${this.title}</h2>
      <p>${this.body}</p>
      <button>DELETE</button>
    `;

    postLi.querySelector('button').addEventListener('click', () => {
      const req = new HTTPRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${this.id}`);
      
      req.execute()
        .then(() => {
          postLi.remove();
        })
        .catch(() => {
          console.log('There was a problem deleting the post.');
        });
    });

    return postLi;
  }
}

class App {
  static init() {
    // Fetch API
    new Form('new-post-fetch', 'available-posts-fetch').init();
    new PostSection('available-posts-fetch').init();
    // XMLHttpRequest
    new Form('new-post-xml', 'available-posts-xml').init();
    new PostSection('available-posts-xml').init();
  }
}

App.init();