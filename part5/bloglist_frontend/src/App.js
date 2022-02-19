import React from 'react';
import { useState, useEffect } from 'react';

import { setToken, login, getAllBlogs, createBlog, likeBlog, deleteBlog } from './services/bloglistService';
import { Form } from './components/FormComponent';
import { DisplayBloglist } from './components/DisplayBloglistComponent.js';
import { Notification } from './components/NotificationComponent';
import { Togglable } from './components/TogglableComponent';

/**
 * The main functional component of the bloglist app
 * @returns {JSX.Element} Main app
 */
function App() {
  const [blogs, setBlogs] = useState([]);
  const [blogsToDisplay, setBlogsToDisplay] = useState(blogs);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [userInfo, setUserInfo] = useState(null);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogURL, setBlogURL] = useState('');

  const [message, setMessage] = useState(null);
  const [inError, setErrorStatus] = useState(false);

  const blogsHook = () => {
    getAllBlogs()
      .then((res) => {
        console.log(res);

        setBlogs(res);
        setBlogsToDisplay(res);
      })
      .catch((err) => {
        console.log(err);

        setErrorStatus(true);
        setMessage(`${err.message}!`);
        setTimeout(() => {
          setMessage(null);
          setErrorStatus(false);
        }, 5000);
      });
  };

  const loginHook = () => {
    console.log('Loading user data from local Storage...');
    let user = window.localStorage.getItem('bloglistUser');

    if (user) {
      console.log('Logging in saved user...');
      user = JSON.parse(user);

      setUserInfo(user);
      setToken(user.token);
      console.log('Done');

      setMessage('Logging in user from previous session...');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } else {
      console.log('No user found in local storage.');
    }
  };

  useEffect(loginHook, []);
  useEffect(blogsHook, [setBlogs, setBlogsToDisplay]);

  const loginForm = {
    onSubmit: (evt) => {
      evt.preventDefault();
      console.log('Logging in user...');

      login(username, password)
        .then((res) => {
          console.log(res);

          setToken(res.token);
          setUserInfo(res);

          setUsername('');
          setPassword('');

          window.localStorage.setItem('bloglistUser', JSON.stringify(res));
          console.log('Done');

          setMessage(`Welcome ${res.name}!`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((err) => {
          console.log(err);

          setPassword('');

          setErrorStatus(true);
          setMessage(`${err.message}!`);
          setTimeout(() => {
            setMessage(null);
            setErrorStatus(false);
          }, 5000);
        });
    },
    inputs: [
      {
        type: 'text',
        name: 'Username',
        value: username,
        onChange: (evt) => setUsername(evt.target.value),
        required: true,
      },
      {
        type: 'text',
        name: 'Password',
        value: password,
        onChange: (evt) => setPassword(evt.target.value),
        required: true,
      },
    ],
    submit: {
      value: 'Log In',
    },
  };

  const createBlogForm = {
    onSubmit: (evt) => {
      evt.preventDefault();

      createBlog(blogTitle, blogAuthor, blogURL)
        .then((res) => {
          console.log('Added a new bloglist entry...');
          console.log(res);

          setBlogs(blogs.concat(res));
          setBlogsToDisplay(blogsToDisplay.concat(res));

          setBlogAuthor('');
          setBlogTitle('');
          setBlogURL('');

          setMessage('You successfully added a new bloglist entry!');
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((err) => {
          console.log(err);

          setErrorStatus(true);
          setMessage(`${err.message}!`);
          setTimeout(() => {
            setMessage(null);
            setErrorStatus(false);
          }, 5000);
        });
    },
    inputs: [
      {
        type: 'text',
        name: 'Title',
        value: blogTitle,
        onChange: (evt) => setBlogTitle(evt.target.value),
        required: true,
      },
      {
        type: 'text',
        name: 'Author',
        value: blogAuthor,
        onChange: (evt) => setBlogAuthor(evt.target.value),
        required: true,
      },
      {
        type: 'text',
        name: 'Url',
        value: blogURL,
        onChange: (evt) => setBlogURL(evt.target.value),
        required: true,
      },
    ],
    submit: {
      value: 'Create',
    },
  };

  const logout = () => {
    console.log(`Logging out ${userInfo.name}...`);

    setToken(null);
    setUserInfo(null);

    window.localStorage.removeItem('bloglistUser');
    console.log('Done');

    setMessage('Logged out successfully.');
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const likeBlogCallback = (id) => {
    likeBlog(id)
      .then(() => {
        setMessage('Liked!');
        setTimeout(() => {
          setMessage('');
        }, 5000);

        getAllBlogs()
          .then((blogs) => {
            setBlogs(blogs);
            setBlogsToDisplay(blogs);
          })
          .catch((err) => {
            console.log(err);

            setErrorStatus(true);
            setMessage(err.message);
            setTimeout(() => {
              setMessage('');
              setErrorStatus(false);
            }, 5000);
          });
      })
      .catch((err) => {
        console.log(err);

        setErrorStatus(true);
        setMessage(err.message);
        setTimeout(() => {
          setMessage('');
          setErrorStatus(false);
        }, 5000);
      });
  };

  const deleteBlogCallback = (id) => {
    deleteBlog(id)
      .then(() => {
        setMessage('Deleted!');
        setTimeout(() => {
          setMessage('');
        }, 5000);

        getAllBlogs()
          .then((blogs) => {
            setBlogs(blogs);
            setBlogsToDisplay(blogs);
          })
          .catch((err) => {
            console.log(err);

            setErrorStatus(true);
            setMessage(err.message);
            setTimeout(() => {
              setMessage('');
              setErrorStatus(false);
            }, 5000);
          });
      })
      .catch((err) => {
        console.log(err);

        setErrorStatus(true);
        setMessage(err.message);
        setTimeout(() => {
          setMessage('');
          setErrorStatus(false);
        }, 5000);
      });
  };

  return (
    <div className="App">
      <h1>Bloglist</h1>
      <Notification
        isError={inError}
        message={message}
      />
      {userInfo
        ? (
          <div>
            <p>Logged in as {userInfo.name}.</p>
            <button onClick={logout}>Logout</button>
            <div id='CreateBlog-Form-Div'>
              <h2>Add a new bloglist entry</h2>
              <Togglable buttonLabel='Create'>
                <Form
                  onSubmit={createBlogForm.onSubmit}
                  inputs={createBlogForm.inputs}
                  submit={createBlogForm.submit}
                />
              </Togglable>
            </div>
          </div>
        )
        : (
          <div id='Login-Form-Div'>
            <p>Have an account? Login</p>
            <Togglable buttonLabel='Log In'>
              <Form
                onSubmit={loginForm.onSubmit}
                inputs={loginForm.inputs}
                submit={loginForm.submit}
              />
            </Togglable>
          </div>
        )
      }
      <div id='Bloglist-Content-Div'>
        <h2>
          {userInfo
            ? 'Your Blogs'
            : 'Bloglist'
          }
        </h2>
        <DisplayBloglist
          bloglist={blogsToDisplay}
          loggedInUser={userInfo ? userInfo.username : null}
          likeCallback={likeBlogCallback}
          deleteCallback={deleteBlogCallback}
        />
      </div>
    </div>
  );
}

export default App;
