import * as tape from "tape";
import type {RouteExecutor} from "../src";
import {registerRoute, dispatch, createURL} from "../src";
import {spy} from "sinon";

tape('routee', (test) => {
  test.test('registerRoute', (test) => {
    const executor: RouteExecutor<['id', 'name'], any> = () => {
    };

    const route = registerRoute('foo/bar', ['id', 'name'], executor);

    test.same(route.id, 'foo/bar');
    test.same(route.segments, ['id', 'name']);
    test.same(route.executor, executor);

    test.end();
  });

  test.test('createURL', (test) => {
    test.same(createURL(registerRoute('foo/bar', ['id', 'name'], () => {
    }), {
      id: '1',
      name: 'lorem'
    }), 'foo/bar/id/1/name/lorem');

    test.same(createURL(registerRoute('foo/bar', [], () => {
    }), {}), 'foo/bar');

    test.end();
  });

  test.test('dispatch', (test) => {
    const route = registerRoute('foo/bar', ['id', 'name'], () => {
    });

    const executor = spy(route, 'executor');

    const dispatchedRoute = dispatch('foo/bar/id/1/name/lorem');

    test.true(executor.called);
    test.same(dispatchedRoute, route);
    test.same(dispatch('foo'), undefined);

    const alikeRoute = registerRoute('foo/bar', ['name', 'id'], () => {
    });

    test.same(dispatch('foo/bar/name/1/id/lorem'), alikeRoute);

    test.end();
  });
});