describe('E2E: Bloglist', () => {
  const users = [
    {
      username: 'jack171',
      firstName: 'Jack',
      lastName: 'Hubert',
      password: '2468',
    },
    {
      username: 'sammy171',
      firstName: 'Samuel',
      lastName: 'Pershing',
      password: '3579',
    },
  ];

  beforeEach(function() {
    localStorage.removeItem('bloglistUser');
    cy
      .request('POST', 'http://localhost:3001/api/testing/reset');

    users.forEach((user) => {
      cy
        .request('POST', 'http://localhost:3001/api/users', user);
    });

    cy
      .visit('http://localhost:3000/');
  });

  describe('before login', function() {
    it('only the requried content is loaded', function() {
      // initially no login form is rendered
      cy
        .contains('Bloglist');
      cy
        .contains('Have an account? Login');
      cy
        .contains('Log In');

      // No blogs present in db
      cy
        .contains('Bloglist is empty. Login and populate it with your favorite blogs.');
    });

    it('login form is rendered when "Sign In" button is pressed', function() {
      // click on "Log In" button to get login form
      cy
        .contains('Log In')
        .click();

      // login form is rendered with all requried elements
      cy
        .contains('Username');
      cy
        .contains('Password');
      cy
        .contains('Log In');
      cy
        .contains('Cancel');
    });

    it('trying to log in with wrong credentials fails', function() {
      // render the login form
      cy
        .contains('Log In')
        .click();

      // logging in with wrong creds
      cy
        .get('form input')
        .eq(0)
        .type('user');
      cy
        .get('form input')
        .eq(1)
        .type('password')
      cy
        .contains('Log In')
        .click();

      // still on the login in page
      cy
        .contains('Username');
      cy
        .contains('Password');
    });

    it('trying to log in with right credentials succeeds', function() {
      // render the login form
      cy
        .contains('Log In')
        .click();

      // logging in with right cresds
      cy
        .get('form input')
        .eq(0)
        .type('jack171');
      cy
        .get('form input')
        .eq(1)
        .type('2468')
      cy
        .contains('Log In')
        .click();

      // login attempt succeeds
      cy
        .contains('Welcome Jack Hubert!')
      cy
        .contains('Logged in as Jack Hubert.');
      cy
        .contains('Logout');
    });
  });

  describe('after logging in', function() {
    beforeEach(function() {
      const user = {
        username: 'jack171',
        password: '2468',
      };

      cy
        .request('POST', 'http://localhost:3001/api/login', user)
        .then(({ body }) => {
          localStorage.setItem('bloglistUser', JSON.stringify(body));
          cy
            .visit('http://localhost:3000');
        })
    });

    const blog = {
      title: 'title of blog',
      author: 'Wribter Aubthor',
      url: 'https://blogger-site3.com/blogs/7475922',
    };

    it('form for creating new entries is not rendered', function() {
      cy
        .contains('Add a new bloglist entry');
      cy
        .contains('Create');
      cy
        .contains('form input')
        .should('not.exist');
    });

    it('clicking the "Create" button renders the form to create new entries', function() {
      cy
        .contains('Create')
        .click();

      cy
        .contains('Title');
      cy
        .contains('Author');
      cy
        .contains('Url');
      cy
        .contains('Create');
      cy
        .contains('Cancel');
    });

    it('users can create add new blogs to the bloglist', function() {
      cy
        .contains('Create')
        .click();

      cy
        .get('form input')
        .eq(0)
        .type(blog.title);
      cy
        .get('form input')
        .eq(1)
        .type(blog.author);
      cy
        .get('form input')
        .eq(2)
        .type(blog.url);

      cy
        .contains('Create')
        .click();

      cy
        .contains('You successfully added a new bloglist entry!');
    });

    describe('After creating a bloglist entry', function() {
      beforeEach(function() {
        cy
          .request({
            method: 'POST',
            url: 'http://localhost:3001/api/blogs',
            auth: {
              'bearer': `${JSON.parse(localStorage.getItem('bloglistUser')).token}`,
            },
            body: blog,
          })
          .then((res) => {
            cy
              .visit('http://localhost:3000');
          });
      });

      it('only partial blog content is loaded', function() {
        cy
          .contains(`${blog.title} by ${blog.author}`);
        cy
          .contains('Expand');
        cy
          .contains('posted by');
      });
  
      it('blog entry also show likes and the like and delete button after clicking "Expand"', function() {
        cy
          .contains('Expand')
          .click();

        cy
          .contains('0 likes');
        cy
          .contains('Like');
        cy
          .contains('Delete');
      });
  
      it('user can like bloglist entries', function() {
        cy
          .contains('Expand')
          .click();

        cy
          .contains('Like')
          .click();

        cy
          .contains('1 likes');
      });

      it('user who created the entry can delete it', function() {
        cy
          .contains('Expand')
          .click();

        cy
          .contains('Delete')
          .click();

        cy
          .contains('Bloglist is empty. Login and populate it with your favorite blogs.');
      });
    });
  });
});
