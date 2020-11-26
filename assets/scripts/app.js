class HTTPRequest {
  constructor(type, url, responseType) {
    this.type = type;
    this.url = url;
    this.responseType = responseType;
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
      req.send();
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
  init() {
    const addPostBtn = document.querySelector('#new-post button');

    addPostBtn.addEventListener('click', (event) => {
      event.preventDefault();
      
      const req = new HTTPRequest('POST', 'https://jsonplaceholder.typicode.com/posts');

      req.execute()
        .then(response => {
          const titleInput = document.getElementById('title');
          const bodyInput = document.getElementById('body');
          const post = new Post(titleInput.value, bodyInput.value);
          const postItem = new PostItem(post);
          const postUl = document.querySelector('#available-posts .posts');
          
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
  init() {
    const fetchPostsBtn = document.querySelector('#available-posts button');

    fetchPostsBtn.addEventListener('click', () => {
      const req = new HTTPRequest('GET', 'https://jsonplaceholder.typicode.com/posts', 'json');

      req.execute()
        .then(response => {
          const posts = [];

          response.forEach(post => {
            posts.push(post);
          });

          document.querySelectorAll('#available-posts li').forEach(li => {
            li.remove();
          });

          new PostList(posts).render();
        })
        .catch(() => {
          console.log('Could not load posts');
        });
    });
  }
}

class PostList {
  constructor(posts) {
    this.posts = posts;
    this.postUl = document.querySelector('#available-posts .posts');
  }

  add(postLi) {
    this.postUl.prepend(postLi);
  }

  render() {
    this.posts.forEach(post => {
      const postLi = new PostItem(post).render();
      this.postUl.append(postLi);
    });
  }
}

class PostItem {
  constructor(post) {
    this.id = post.id;
    this.title = post.title;
    this.body = post.body;
  }

  render() {
    const postLi = document.createElement('li');
    
    postLi.setAttribute('data-id', this.id);
    postLi.classList.add('post-item');
    postLi.innerHTML = `
      <h2>${this.title}</h2>
      <p>${this.body}</p>
      <button>DELETE</button>
    `;

    postLi.querySelector('button').addEventListener('click', () => {
      const req = new HTTPRequest('DELETE', 'https://jsonplaceholder.typicode.com/posts/1');
      
      req.execute()
        .then(() => {
          document.querySelector(`[data-id="${this.id}"]`).remove();
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
    this.form = new Form().init();
    this.postSection = new PostSection().init();
  }
}

App.init();