# dom-component-path

> Get the component path of a DOM element.

## Install

Requires [matches-selector][].

```
npm install @caillou/dom-component-path
```

[matches-selector]: https://github.com/ForbesLindesay/matches-selector

## Example

Running the following code:

```javascript
import domComponentPath from 'dom-component-path'
const h1 = document.querySelector('h1')
const path = domComponentPath(h1)
```

With the following HTML:

```html
<html lang="en">
  <body data-abstract-component="detail page">
    <div id="main">
      <div class="module">
        <h1>Hello World</h1>
      </div>
    </div>
  </body>
</html>
```

Yields the following result:

```JSON
[
  {
    "name": "Tag: html",
    "position": 1
  },
  {
    "name": "Component: detail page",
    "position": 1
  },
  {
    "name": "ID: main",
    "position": 1
  },
  {
    "name": "Class: module",
    "position": 1
  },
  {
    "name": "Tag: h1",
    "position": 1
  }
]
```

# Running Tests

Tests can be easilly run locally as follows:

```bash
npm install
npm test
```
