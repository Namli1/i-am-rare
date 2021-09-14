import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Import all page components here
 */
import Game from "./index.js";
import PrivacyPolicy from "./privacy_policy.js";

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={Game}>
    <IndexRoute component={Game} />
    <Route path="/privacy-policy/" component={PrivacyPolicy} />
  </Route>
);