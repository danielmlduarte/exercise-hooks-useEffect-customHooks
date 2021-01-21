import React, { createContext, useState, useEffect } from 'react';
import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();
const { Provider, Consumer } = Context;

function RedditProvider({ children }) {
  const [postsBySubreddit, setPostsBySubreddit] = useState({
    frontend: {},
    reactjs: {},
  });

  const [selectedSubreddit, setSelectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, setShouldRefreshSubreddit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [selectedSubreddit, shouldRefreshSubreddit]);

  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;

    setShouldRefreshSubreddit(false);
    setIsFetching(true);

    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  }

  const shouldFetchPosts = () => {
    const posts = postsBySubreddit[selectedSubreddit];
    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  }

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit({
      ...postsBySubreddit,
      [selectedSubreddit]: {
        items,
        lastUpdated,
      }
    });

  }

  const handleFetchError = (error) => {
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit({
      ...postsBySubreddit,
      [selectedSubreddit]: {
        error: error.message,
        items: [],
      }
    });
  }

  const handleSubredditChange = (selectedSubreddit) => {
    setSelectedSubreddit(selectedSubreddit);
  }

  const handleRefreshSubreddit = () => {
    setShouldRefreshSubreddit(true);
  }

  const context = {
    selectedSubreddit,
    postsBySubreddit,
    shouldRefreshSubreddit,
    isFetching,
    selectSubreddit: handleSubredditChange,
    fetchPosts: fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };

  return (
    <Provider value={context}>
      {children}
    </Provider>
  );

}

export { RedditProvider as Provider, Consumer, Context };
