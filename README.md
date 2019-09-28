# result-object

A simple data structure useful for:

- Writing async code that does not rely on throwing errors for control flow, see: the overuse of try/catch with async/await
- Derefencing async data structures (promises, observables, etc) when necessary, see: hooks in functional React components
- Typing errors in TypeScript

## Install

```
yarn add result-object
```

## Use

Here's an example of how you might use it. (This is the source for [use-deref](https://www.npmjs.com/package/use-deref))

```ts
// use-deref.ts

import { useState, useEffect } from "react";
import { loading, ready, error, Result } from "result-object";

export const useDeref = <T>(fn: () => Promise<T>): Result<T, any> => {
  const [result, setResult] = useState<Result<T, any>>(() => loading());

  useEffect(() => {
    fn().then(value => setResult(ready(value)), err => setResult(error(err)));
  }, []);

  return result;
};
```

### Why?

Libraries like [Apollo](https://github.com/apollographql/apollo-client) and [Draqula](https://github.com/vadimdemedes/draqula) represent async state with the following shape

```ts
type OpenResult<T> = {
  loading: boolean;
  error: Error | null;
  data: T | null;
};
```

Though this is fine in JavaScript, it's not with TypeScript because it violates the idea that you should, ["make illegal states unrepresentable"](https://blog.janestreet.com/effective-ml-revisited/). That is to say, the following are valid results as far as TypeScript is concerned

```ts
const resultA: OpenResult<{ id: number }> = { loading: false, error: null, data: null };
const resultB: OpenResult<{ id: number }> = {
  loading: true,
  error: [new Error("!!!")],
  data: { id: 123 }
};
// etc..
```

Even though libraries may never represent results in this way, these values are difficult to handle succinctly because checking the `loading` flag doesn't actually tell us anything about `error` or `data`. Whatever the outcome, we will still need to null check on those keys.

What we really have are three distinctly unique types which we can switch on: `loading`, `ready` and `error`. It's similar to how TypeScript handles Redux actions in a reducer if you're familiar with that. Checking on the `type` key of the result tells you enough about what the result is.
