import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DisplayBloglistItem } from './DisplayBloglistComponent';

describe('Component: DisplayBloglistItem', () => {
  let container;

  const blog = {
    title: 'title of blog',
    author: 'author of blog',
    url: 'https://some-domain.com/blog/id',
    likes: 0,
    user: {
      username: 'user',
      name: 'nameOfUser',
    },
  };

  const loggedInUser = 'user';

  beforeEach(() => {
    container = render(
      <DisplayBloglistItem
        blogItem={blog}
        loggedInUser={loggedInUser}
      />
    ).container;
  });

  test('Renders partial blog content(title, author, "expand" button and user)', () => {
    const element = container
      .querySelector('.bloglistItem');

    screen
      .debug();

    expect(element)
      .toBeDefined();
    expect(element)
      .toHaveTextContent(blog.title);
    expect(element)
      .toHaveTextContent(`by ${blog.author}`);
    expect(element)
      .toHaveTextContent(`posted by ${blog.user.username}`);
  });

  test('Properly expands the blog showing the number of likes, the like and delete buttons', () => {
    const expandButton = screen
      .getByText('Expand');

    userEvent.click(expandButton);

    screen
      .debug();

    expect(container)
      .toHaveTextContent(`${blog.likes} likes`);
    expect(container)
      .toHaveTextContent('Like');
    expect(container)
      .toHaveTextContent('Delete');
  });
});
