import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import App from '../App';
import { defaultSubreddit } from '../config';

function setup(initialPath = '/') {
  let history;
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
      <Route
        path="*"
        render={(props) => {
          history = props.history;
          return null;
        }}
      />
    </MemoryRouter>,
  );
  return { history };
}

describe('Subreddit Form', () => {
  test('Input value changes to defaultsubreddit when you navigate to search page', () => {
    setup('/search/reactjs');
    const subredditInput = screen.getByRole('textbox');
    const header = screen.getByRole('banner');
    const searchLink = within(header).getByRole('link', { name: /Search/ });

    userEvent.click(searchLink);
    expect(subredditInput.value).toBe(defaultSubreddit);
  });

  test('Updates the URL with the input value when search button is clicked', () => {
    const { history } = setup('/search/reactjs');
    const subredditInput = screen.getByLabelText('r /');
    expect(subredditInput.value).toBe('reactjs');

    userEvent.clear(subredditInput);
    userEvent.type(subredditInput, 'vuejs');
    expect(subredditInput.value).toBe('vuejs');

    const searchButton = screen.getByRole('button', {
      name: /search/i,
    });
    userEvent.click(searchButton);
    expect(history.location.pathname).toEqual('/search/vuejs');
  });
});