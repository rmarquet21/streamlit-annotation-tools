import { ILabel } from "../types/labelerTypes"

export const isLabeled = (
  start: number,
  end: number,
  labels: ILabel[]
): boolean => {
  return labels.some(
    (label) =>
      (start >= label.start && end <= label.end) ||
      (start <= label.start && end >= label.end) ||
      (start <= label.start && end > label.start && end <= label.end) ||
      (start >= label.start && start < label.end && end >= label.end)
  )
}

export const removeLabelData = (
  start: number,
  end: number,
  labels: ILabel[]
): ILabel[] => {
  return labels.filter(
    (label) =>
      !(start >= label.start && end <= label.end) &&
      !(start <= label.start && end >= label.end) &&
      !(start <= label.start && end > label.start && end <= label.end) &&
      !(start >= label.start && start < label.end && end >= label.end)
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

export const snakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .join("_")
    .toLowerCase()
}

export const formatKeys = (
  dict: { [key: string]: any },
  isSnakeCase: boolean
): { [key: string]: any } => {
  if (!isSnakeCase) {
    return dict
  }

  const formattedDict: { [key: string]: any } = {}
  Object.keys(dict).forEach((key) => {
    formattedDict[snakeCase(key)] = dict[key]
  })

  return formattedDict
}
