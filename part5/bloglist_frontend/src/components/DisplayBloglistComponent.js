import React from 'react';
import { useState } from 'react';

const DisplayBloglistItem = ({ blogItem, loggedInUser, likeCallback, deleteCallback }) => {
  const [showExpandedView, toggleExpandedView] = useState(false);

  const toggleView = () => {
    toggleExpandedView(!showExpandedView);
  };

  return (
    <div className='bloglistItem'>
      {showExpandedView
        ? (
          <>
            <p>
              <a href={blogItem.url}>
                {blogItem.title}
              </a> by {blogItem.author}
              <button onClick={toggleView}>
                Back
              </button>
            </p>
            <p>posted by {blogItem.user.username}</p>
            <p>
              {blogItem.likes} likes
              <button onClick={() => likeCallback(blogItem.id)}>
                Like
              </button>
            </p>
            {loggedInUser === blogItem.user.username
              && (
                <button onClick={() => deleteCallback(blogItem.id)}>
                  Delete
                </button>
              )
            }
          </>
        )
        : (
          <>
            <p>
              <a href={blogItem.url}>
                {blogItem.title}
              </a> by {blogItem.author}
              <button onClick={toggleView}>
                Expand
              </button>
            </p>
            <p>posted by {blogItem.user.username}</p>
          </>
        )
      }
    </div>
  );
};

const DisplayBloglist = ({ bloglist, loggedInUser, likeCallback, deleteCallback }) => {
  if (!bloglist || bloglist.length === 0) {
    return (
      <div>
        <p>Bloglist is empty. Login and populate it with your favorite blogs.</p>
      </div>
    );
  }

  return (
    <div>
      {bloglist.map((blogItem) => (
        <div key={blogItem.id}>
          <hr/>
          <DisplayBloglistItem
            blogItem={blogItem}
            loggedInUser={loggedInUser}
            likeCallback={likeCallback}
            deleteCallback={deleteCallback}
          />
        </div>
      ))}
    </div>
  );
};

export {
  DisplayBloglist,
  DisplayBloglistItem,
};
