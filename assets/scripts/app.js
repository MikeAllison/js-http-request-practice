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
        req.responseType = this.responseType 
      };

      req.open(this.type, this.url);
      req.onload = () => resolve(req.response);
      req.onerror = () => reject(req);
      req.send();
    });
  }
}

class PostSection {
  init() {
    const fetchPostsBtn = document.querySelector('#available-posts button');

    fetchPostsBtn.addEventListener('click', () => {
      const req = new HTTPRequest('GET', 'https://jsonplaceholder.typicode.com/posts', 'json');

      req.execute()
        .then((response) => {
          document.querySelectorAll('#available-posts li').forEach(li => {
            li.remove();
          });

          new PostList(response).render();
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
  }

  render() {
    const postUl = document.querySelector('#available-posts .posts');

    this.posts.forEach(postData => {
      const postLi = new PostElement(postData).render();
      postUl.append(postLi);
    });
  }
}

class PostElement {
  constructor(postData) {
    this.id = postData.id;
    this.title = postData.title;
    this.body = postData.body;
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
          console.log('There was a problem deleting the post.')
        });
    });

    return postLi;
  }
}

class App {
  static init() {  
    new PostSection().init();
  }
}

App.init();