import React from 'react';
import { PlayerName } from '../CoveyTypes';

/**
 * Hint: You will never need to use this directly. Instead, use the
 * `useUserProfile` or `useMaybeUserProfile` hooks.
 */
const Context = React.createContext<PlayerName | null>({
  name: '',
  setName: () => {},
});

export default Context;