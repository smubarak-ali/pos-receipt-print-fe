export function deepQuerySelectorAll(query: string, element: Element = document.body) {
    const result: Element[] = Array.from(
        element.shadowRoot
            ? element.shadowRoot.childNodes
            : element.nodeName === 'SLOT'
                ? (<HTMLSlotElement>element).assignedElements()
                : element.childNodes,
    )
        .filter((element: ChildNode): element is Element => element instanceof Element)
        .map((element: Element) => deepQuerySelectorAll(query, element))
        .flat();

    if ((<Element>element).matches?.(query)) {
        result.push(<Element>element)
    }

    return result;
}