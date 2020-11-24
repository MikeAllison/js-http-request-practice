class HTTPRequest {
  constructor(type, url, responseType) {
    this.type = type;
    this.url = url;
    this.responseType = responseType;
  }

  execute() {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      
      req.responseType = this.responseType;
      req.open(this.type, this.url);
      req.onload = () => resolve(req.response);
      req.onerror = () => reject(req);
      req.send();
    });
  }
}

class PostList {
  constructor(posts) {
    this.posts = posts;  
  }

  render() {
    const postUl = document.querySelector('#available-posts .posts');

    this.posts.forEach(post => {
      const postLi = new Post(post.title, post.body).render();
      postUl.append(postLi);
    });
  }
}

class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  render() {
    const postLi = document.createElement('li');
    
    postLi.classList.add('post-item');
    postLi.innerHTML = `
      <h2>${this.title}</h2>
      <p>${this.body}</p>
      <button>DELETE</button>
    `;

    return postLi;
  }
}

class App {
  static init() {
    const req = new HTTPRequest('GET', 'https://jsonplaceholder.typicode.com/posts', 'json');

    req.execute()
      .then((response) => {
        new PostList(response).render();
      })
      .catch(() => {
        console.log('Request failed');
      });
  }
}

App.init();