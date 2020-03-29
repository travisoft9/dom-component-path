import domComponentPath from './index.js'
import { assert } from 'chai'

describe('component-path:', () => {
  describe('get:', () => {
    describe('tag name:', () => {
      it('returns an array', () => {
        assert.isArray(getResultFor('<a data-select href="https://foo.bar/baz">hello</a>'))
      })

      it('returns the passed element in the array', () => {
        assert.deepEqual(
          getResultFor('<a data-select href="https://foo.bar/baz">hello</a>'),
          [{
            name: 'Tag: a',
            position: 1
          }]
        )
      })

      it('returns the passed element and its parents', () => {
        assert.deepEqual(
          getResultFor('<div><a data-select href="https://foo.bar/baz">hello</a>'),
          [{
            name: 'Tag: div',
            position: 1
          },
          {
            name: 'Tag: a',
            position: 1
          }]
        )
      })

      it('returns the correct position for an element', () => {
        assert.deepEqual(
          getResultFor('<div></div><div><a data-select href="https://foo.bar/baz">hello</a></div>'),
          [{
            name: 'Tag: div',
            position: 2
          },
          {
            name: 'Tag: a',
            position: 1
          }]
        )
      })
    })

    describe('classes:', () => {
      it('returns the passed element in the array', () => {
        assert.deepEqual(
          getResultFor('<a class="foo bar" data-select href="https://foo.bar/baz">hello</a>'),
          [{
            name: 'Class: foo bar',
            position: 1
          }]
        )
      })

      it('returns the passed element and its parents', () => {
        assert.deepEqual(
          getResultFor(`
            <div class=quux>
              <a class="foo bar" data-select href="https://foo.bar/baz">hello</a>
            </div>
          `),
          [{
            name: 'Class: quux',
            position: 1
          },
          {
            name: 'Class: foo bar',
            position: 1
          }]
        )
      })

      it('returns the correct position for an element', () => {
        assert.deepEqual(
          getResultFor(`
            <div class=quux></div>
            <div class=quux></div>
            <div class=quux>
              <a href="/lalala"></a>
              <a class="foo bar" href="https://foo.bar/baz">hello</a>
              <a class="foo bar" data-select href="https://foo.bar/baz">hello</a>
            </div>
          `),
          [{
            name: 'Class: quux',
            position: 3
          },
          {
            name: 'Class: foo bar',
            position: 2
          }]
        )
      })
    })

    describe('ids:', () => {
      it('returns the passed element in the array', () => {
        assert.deepEqual(
          getResultFor('<a id=foo data-select href="https://foo.bar/baz">hello</a>'),
          [{
            name: 'ID: foo',
            position: 1
          }]
        )
      })

      it('returns the passed element and its parents', () => {
        assert.deepEqual(
          getResultFor(`
            <div id=quux>
              <a id="foo" href="https://foo.bar/baz">hello</a>
              <a id="bar" data-select href="https://foo.bar/baz">hello</a>
            </div>
          `),
          [{
            name: 'ID: quux',
            position: 1
          },
          {
            name: 'ID: bar',
            position: 1
          }]
        )
      })
    })

    describe('data-abstract-component attribute:', () => {
      it('returns the passed element in the array', () => {
        assert.deepEqual(
          getResultFor('<a data-abstract-component=foo data-select href="https://foo.bar/baz">hello</a>'),
          [{
            name: 'Component: foo',
            position: 1
          }]
        )
      })

      it('returns the passed element and its parents', () => {
        assert.deepEqual(
          getResultFor(`
            <div data-abstract-component=quux>
              <a data-abstract-component="foo" href="https://foo.bar/baz">hello</a>
              <a data-abstract-component="bar" href="https://foo.bar/baz">hello</a>
              <a data-abstract-component="bar" data-select href="https://foo.bar/baz">hello</a>
            </div>
          `),
          [{
            name: 'Component: quux',
            position: 1
          },
          {
            name: 'Component: bar',
            position: 2
          }]
        )
      })
    })

    describe('prioritizes:', () => {
      it('first the data-attribute', () => {
        const html = `
          <a
            data-abstract-component=component-bar
            id=id-bar
            class=class-bar
            href="https://bar.bar/baz"
          >
            bar
          </a>
          <a
            data-abstract-component=component-foo
            id=id-foo
            class=class-foo
            href="https://foo.bar/baz"
          >
            foo
          </a>
          <a
            data-select
            data-abstract-component=component-foo
            id=id-foo
            class=class-foo
            href="https://foo.bar/baz"
          >
            foo
          </a>
        `
        assert.deepEqual(
          getResultFor(html),
          [{
            name: 'Component: component-foo',
            position: 2
          }]
        )
      })

      it('second the ID', () => {
        const html = `
          <a
            id=id-bar
            class=class-bar
            href="https://foo.bar/baz"
          >
            bar
          </a>
          <a
            id=id-foo
            class=class-foo
            href="https://foo.bar/baz"
          >
            foo
          </a>
          <a
            data-select
            id=id-foo
            class=class-foo
            href="https://foo.bar/baz"
          >
            foo
          </a>
        `
        assert.deepEqual(
          getResultFor(html),
          [{
            name: 'ID: id-foo',
            position: 2
          }]
        )
      })

      it('third the class name', () => {
        const html = `
          <a
            class=class-foo
            href="https://foo.bar/baz"
          >
            foo
          </a>
          <a
            data-select
            class=class-foo
            href="https://foo.bar/baz"
          >
            foo
          </a>
        `
        assert.deepEqual(
          getResultFor(html),
          [{
            name: 'Class: class-foo',
            position: 2
          }]
        )
      })

      it('last the tag name', () => {
        const html = `
          <a
            href="https://foo.bar/baz"
          >
            foo
          </a>
          <a
            data-select
            href="https://foo.bar/baz"
          >
            foo
          </a>
        `
        assert.deepEqual(
          getResultFor(html),
          [{
            name: 'Tag: a',
            position: 2
          }]
        )
      })
    })

    it('complex test with body and html', () => {
      const html = `
      <html lang="en">
        <body data-abstract-component="detail page">
          <div id="main" class="main-class">
            <div class="module">
              <p>
                Lorem ipsum dolor sit, <a href="./amet">amet</a> consectetur adipisicing elit.
              </p>
            </div>
            <div class="module">
              <ul class="sbb-list">
                <li><a href="/green">Green</a></li>
              </ul>
              <ul class="sbb-list sbb-list--fancy">
                <li><a href="/1">Eins</a></li>
                <li><a href="/2">Zwei</a></li>
                <li>
                  <a data-select href="/3">
                    <!-- CLICK WAS TRIGGERED HERE -->
                    Drei
                  </a>
                </li>
                <li><a href="/4">Vier</a></li>
                <li><a href="/5">Fünf</a></li>
              </ul>
            </div>
          </div>
        </body>
      </html>
      `
      document.documentElement.innerHTML = html
      const node = document.querySelector('[data-select]')
      assert.deepEqual(
        domComponentPath(node),
        [
          {
            name: 'Tag: html',
            position: 1
          },
          {
            name: 'Component: detail page',
            position: 1
          },
          {
            name: 'ID: main',
            position: 1
          },
          {
            name: 'Class: module',
            position: 2
          },
          {
            name: 'Class: sbb-list sbb-list--fancy',
            position: 1
          },
          {
            name: 'Tag: li',
            position: 3
          },
          {
            name: 'Tag: a',
            position: 1
          }
        ]
      )
    })
  })
})

function getResultFor (html) {
  return domComponentPath(
    getAndSelectFragmantFromHtml(html, '[data-select]')
  )
}
function getAndSelectFragmantFromHtml (html, selector) {
  const root = document.createElement('root')
  root.innerHTML = html
  const fragment = document.createDocumentFragment()
  const children = Array.from(root.children)
  children.forEach((child) => fragment.appendChild(child))
  return fragment.querySelector(selector)
}
