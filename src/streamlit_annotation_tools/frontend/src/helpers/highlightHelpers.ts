import { IReference } from "../types/highlightTypes"

export const isHighlighted = (
  start: number,
  end: number,
  highlights: IReference[]
): boolean => {
  return highlights.some(
    (highlight) =>
      (start >= highlight.start && end <= highlight.end) ||
      (start <= highlight.start && end >= highlight.end) ||
      (start <= highlight.start &&
        end > highlight.start &&
        end <= highlight.end) ||
      (start >= highlight.start &&
        start < highlight.end &&
        end >= highlight.end)
  )
}

export const removeHighlight = (
  start: number,
  end: number,
  highlights: IReference[]
): IReference[] => {
  return highlights.filter(
    (highlight) =>
      !(start >= highlight.start && end <= highlight.end) &&
      !(start <= highlight.start && end >= highlight.end) &&
      !(
        start <= highlight.start &&
        end > highlight.start &&
        end <= highlight.end
      ) &&
      !(
        start >= highlight.start &&
        start < highlight.end &&
        end >= highlight.end
      )
  )
}

export const getCharactersCountUntilNode = (
  node: Node,
  parent: HTMLElement | null
): number => {
  const walker = document.createTreeWalker(
    parent || document.body,
    NodeFilter.SHOW_TEXT,
    null
  )

  let charCount = 0
  while (walker.nextNode()) {
    if (walker.currentNode === node) {
      break
    }
    charCount += walker.currentNode.textContent?.length || 0
  }

  return charCount
}

export const adjustSelectionBounds = (
  textContent: string,
  startIndex: number,
  endIndex: number
): { start: number; end: number } => {
  let startAdjustment = 0
  let endAdjustment = 0

  const reStartIndex = /^[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
  while (
    !(
      textContent.charAt(startIndex + startAdjustment - 1) === " " ||
      textContent.charAt(startIndex + startAdjustment - 1).match(reStartIndex)
    ) &&
    textContent.charAt(startIndex + startAdjustment - 1) !== ""
  ) {
    startAdjustment -= 1
  }

  const reEndIndex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]$/g
  while (
    !(
      textContent.charAt(endIndex + endAdjustment) === " " ||
      textContent.charAt(endIndex + endAdjustment).match(reEndIndex)
    ) &&
    textContent.charAt(endIndex + endAdjustment) !== ""
  ) {
    endAdjustment += 1
  }

  return {
    start: startIndex + startAdjustment,
    end: endIndex + endAdjustment,
  }
}
