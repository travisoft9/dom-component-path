import matches from 'matches-selector'

export default function domComponentPath (element) {
  const componentPath = []

  while (element) {
    const { name, selector } = getElementNameAndSelector(element)
    const position = 1 + getPoistion(element, selector)

    componentPath.unshift({
      name,
      position
    })
    element = element.parentElement
  }
  return componentPath
}

function getPoistion (element, selector) {
  const siblings = Array.from(element.parentNode.children)
  const similarSiblings = siblings.filter((childNode) => {
    return matches(childNode, selector)
  })

  return similarSiblings.indexOf(element)
}

function getElementNameAndSelector (element) {
  const component = element.dataset.abstractComponent

  if (component) {
    return {
      name: `Component: ${component}`,
      selector: `[data-abstract-component="${component}"]`
    }
  }

  if (element.id) {
    const idSelector = '#' + element.id
    return {
      name: `ID: ${element.id}`,
      selector: idSelector
    }
  }

  if (element.className) {
    const classSelector = '.' + element.className.split(' ').join('.')
    return {
      name: `Class: ${element.className}`,
      selector: classSelector
    }
  }

  const tagName = element.tagName.toLowerCase()
  return {
    name: `Tag: ${tagName}`,
    selector: tagName
  }
}
