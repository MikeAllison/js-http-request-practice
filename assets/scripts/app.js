class HTTPRequestWrapper {
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
    this.id = Math.random();
    this.title = title;
    this.body = body;
  }
}

class FetchReqForm {
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
      
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData)
      })
      .then(response => {
        const post = new Post(titleInput.value, bodyInput.value);
        const postItem = new FetchReqPostItem(this.renderHook, post);
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

class XMLHttpReqForm {
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
      
      const req = new HTTPRequestWrapper('POST', 'https://jsonplaceholder.typicode.com/posts', null, reqData);

      req.execute()
        .then(response => {
          const post = new Post(titleInput.value, bodyInput.value);
          const postItem = new XMLHttpReqPostItem(this.renderHook, post);
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
}

class FetchReqPostSection extends PostSection {
  init() {
    const fetchPostsBtn = document.querySelector(`#${this.renderHook} button`);

    fetchPostsBtn.addEventListener('click', () => {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
            document.querySelectorAll(`#${this.renderHook} li`).forEach(li => {
            li.remove();
          });

          new FetchReqPostList(this.renderHook, posts).render();
        })
        .catch(() => {
          console.log('Could not load posts');
        });;
    });
  }
}

class XMLHttpReqPostSection extends PostSection {
  init() {
    const fetchPostsBtn = document.querySelector(`#${this.renderHook} button`);

    fetchPostsBtn.addEventListener('click', () => {
      const req = new HTTPRequestWrapper('GET', 'https://jsonplaceholder.typicode.com/posts', 'json');

      req.execute()
        .then(posts => {
            document.querySelectorAll(`#${this.renderHook} li`).forEach(li => {
            li.remove();
          });

          new XMLHttpReqPostList(this.renderHook, posts).render();
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
}

class FetchReqPostList extends PostList {
  render() {
    this.posts.forEach(post => {
      const postLi = new FetchReqPostItem(this.renderHook, post).render();
      this.postUl.append(postLi);
    });
  }
}

class XMLHttpReqPostList extends PostList {
  render() {
    this.posts.forEach(post => {
      const postLi = new XMLHttpReqPostItem(this.renderHook, post).render();
      this.postUl.append(postLi);
    });
  }
}

class PostItem {
  constructor(renderHook, post) {
    this.renderHook = renderHook;
    this.id = post.id;
    this.title = post.title;
    this.body = post.body;
  }
}

class FetchReqPostItem extends PostItem {
  render() {
    const postLi = document.createElement('li');
    postLi.classList.add('post-item');
    postLi.innerHTML = `
      <h2>${this.title}</h2>
      <p>${this.body}</p>
      <button>DELETE</button>
    `;

    postLi.querySelector('button').addEventListener('click', () => {
      console.log(this);
      fetch(`https://jsonplaceholder.typicode.com/posts/${this.id}`, {
        method: 'DELETE'
      })
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

class XMLHttpReqPostItem extends PostItem {
  render() {
    const postLi = document.createElement('li');
    postLi.classList.add('post-item');
    postLi.innerHTML = `
      <h2>${this.title}</h2>
      <p>${this.body}</p>
      <button>DELETE</button>
    `;

    postLi.querySelector('button').addEventListener('click', () => {
      const req = new HTTPRequestWrapper('DELETE', `https://jsonplaceholder.typicode.com/posts/${this.id}`);
      
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
    new FetchReqForm('new-post-fetch', 'available-posts-fetch').init();
    new FetchReqPostSection('available-posts-fetch').init();
    // XMLHttpRequest
    new XMLHttpReqForm('new-post-xml', 'available-posts-xml').init();
    new XMLHttpReqPostSection('available-posts-xml').init();
  }
}

App.init();