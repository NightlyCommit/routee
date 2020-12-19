type SanitizeRouteParameters<T> = T extends Record<infer K, any> ? ([K] extends [never] ? Record<string, never> : Record<K, string>) : T;
type ExecutorParameters<T extends Array<string>> = SanitizeRouteParameters<Record<T[number], string>>;
type Keys<O> = Array<keyof O & string>;

export type RouteExecutor<P extends Array<string>, S extends Record<any, any>> = (parameters: ExecutorParameters<P>, state: S) => void;

export type RouteInterface<Segments extends Array<string>, State extends Record<string, any> = undefined> = {
  id: string;
  segments: Segments;
  executor: RouteExecutor<Segments, State>;
};

const getRoutePattern = <P extends Array<string>>(route: RouteInterface<P>): string => {
  let pattern: string = `^${route.id}`;

  const segments = route.segments;

  if (segments.length > 0) {
    pattern += '/';

    pattern += (`(${[...segments].map((segment) => {
      return `(${segment}/.*)`;
    }).join('/')})`);
  }

  pattern += '$';

  return pattern;
};

const routes: Map<string, RouteInterface<Array<string>, Record<string, any>>> = new Map();

/**
 * Create and register a route.
 *
 * @param id
 * @param segments
 * @param executor
 */
export const registerRoute = <P, S>(
  id: string,
  segments: Keys<P> | Array<undefined>,
  executor: RouteExecutor<Keys<P> | Array<undefined>, S>
): RouteInterface<Keys<P>, S> => {
  const route = {
    id,
    segments,
    executor
  };

  routes.set(getRoutePattern(route), route);

  return route;
};

/**
 * Create an URL for the route with the given parameters.
 *
 * @param route
 * @param parameters
 */
export const createURL = <P extends Array<string>>(route: RouteInterface<P>, parameters: ExecutorParameters<P>): string => {
  const parts: Array<string> = [route.id];

  const parametersMap: Map<string, string> = new Map();

  for (let key in parameters) {
    parametersMap.set(key, parameters[key]);
  }

  const keys = [...parametersMap.keys()].sort();

  for (let key of keys) {
    parts.push(key);
    parts.push(parametersMap.get(key));
  }

  return parts.join('/');
};

/**
 * Dispatch a location to the corresponding route, if any, and return that route.
 *
 * @param location
 */
export const dispatch = (location: string): RouteInterface<any> | undefined => {
  let dispatchedRoute: RouteInterface<any>;

  for (const [pattern, route] of routes) {
    const regExp = new RegExp(pattern);

    if (regExp.test(location)) {
      dispatchedRoute = route;

      const matches = regExp.exec(location);
      const parameters: Record<string, string> = {};

      matches.splice(0, 2);

      for (let match of matches) {
        const [key, value] = match.split('/');

        parameters[key] = value;
      }

      route.executor(parameters, {});

      break;
    }
  }

  return dispatchedRoute;
}
