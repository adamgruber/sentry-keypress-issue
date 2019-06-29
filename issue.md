<!-- Requirements: please go through this checklist before opening a new issue -->

- [x] Review the documentation: https://docs.sentry.io/
- [x] Search for existing issues: https://github.com/getsentry/sentry-javascript/issues
- [x] Use the latest release: https://github.com/getsentry/sentry-javascript/releases
- [ ] Provide a link to the affected event from your Sentry account

## Package + Version

- [x] `@sentry/browser`
- [ ] `@sentry/node`
- [ ] `raven-js`
- [ ] `raven-node` _(raven for node)_
- [ ] other:

### Version:

```
5.4.3
```
Issue first appeared in `5.1.0` via https://github.com/getsentry/sentry-javascript/commit/bd3f72ec062abf16e92e2d18e12baeb72d199a76

## Description

See demo: https://github.com/adamgruber/sentry-keypress-issue

The Breadcrumb integration prevents `keypress` listeners that have been added using an object with a `handleEvent` property.

I believe the issue comes from [this line](https://github.com/getsentry/sentry-javascript/blob/master/packages/browser/src/integrations/breadcrumbs.ts#L160) inside `/integrations/breadcrumbs.ts`:

```ts
// ...
if (fn && (fn as any).handleEvent) {
  if (eventName === 'click') {
    fill(fn, 'handleEvent', function(innerOriginal: () => void): (caughtEvent: Event) => void {
      return function(this: any, event: Event): (event: Event) => void {
        breadcrumbEventHandler('click')(event);
        return innerOriginal.call(this, event);
      };
    });
  }
  if (eventName === 'keypress') {
    fill(fn, 'handleEvent', keypressEventHandler());
  }
//...
}
```

When `fill()` is called, it attempts to replace `handleEvent` with a wrapped version but actually sets it to `undefined`. This change seems to fix the issue:

```ts
// ...
if (fn && (fn as any).handleEvent) {
  if (eventName === 'click') {
    fill(fn, 'handleEvent', function(innerOriginal: () => void): (caughtEvent: Event) => void {
      return function(this: any, event: Event): (event: Event) => void {
        breadcrumbEventHandler('click')(event);
        return innerOriginal.call(this, event);
      };
    });
  }
  if (eventName === 'keypress') {
    fill(fn, 'handleEvent', function(innerOriginal: () => void): (caughtEvent: Event) => void {
      return function(this: any, event: Event): (event: Event) => void {
        keypressEventHandler()(event);
        return innerOriginal.call(this, event);
      };
    });
  }
//...
```

