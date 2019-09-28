type ResultBase<
  Type extends string,
  IsReady extends boolean,
  IsLoading extends boolean,
  IsError extends boolean,
  Data
> = {
  type: Type;
  isReady: IsReady;
  isLoading: IsLoading;
  isError: IsError;
  data: Data;
};

class LoadingResult implements ResultBase<"loading", false, true, false, null> {
  static create() {
    return new LoadingResult();
  }

  type = "loading" as "loading";
  isReady = false as false;
  isLoading = true as true;
  isError = false as false;
  data = null;
}

class ReadyResult<T> implements ResultBase<"ready", true, false, false, T> {
  static create<U>(data: U) {
    return new ReadyResult(data);
  }

  type = "ready" as "ready";
  isReady = true as true;
  isLoading = false as false;
  isError = false as false;

  constructor(public data: T) {}
}

class ErrorResult<T> implements ResultBase<"error", false, false, true, T> {
  static create<U>(data: U) {
    return new ErrorResult(data);
  }

  type = "error" as "error";
  isReady = false as false;
  isLoading = false as false;
  isError = true as true;

  constructor(public data: T) {}
}

export type Result<T, E> = LoadingResult | ReadyResult<T> | ErrorResult<E>;
export const loading = LoadingResult.create;
export const ready = ReadyResult.create;
export const error = ErrorResult.create;
