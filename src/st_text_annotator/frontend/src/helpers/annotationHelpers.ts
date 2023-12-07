import { IReference } from "../types";

export const isAnnotated = (start: number, end: number, annotations: IReference[]): boolean => {
    return annotations.some(annotation => 
          (start >= annotation.start && end <= annotation.end) ||
          (start <= annotation.start && end >= annotation.end) ||
          (start <= annotation.start && end > annotation.start && end <= annotation.end) ||
          (start >= annotation.start && start < annotation.end && end >= annotation.end)
        )
};

export const removeAnnotation = (start: number, end: number, annotations: IReference[]): IReference[] => {
    return annotations.filter(annotation => 
          !(start >= annotation.start && end <= annotation.end) &&
          !(start <= annotation.start && end >= annotation.end) &&
          !(start <= annotation.start && end > annotation.start && end <= annotation.end) &&
          !(start >= annotation.start && start < annotation.end && end >= annotation.end)
        );
    }

export const getCharactersCountUntilNode = (node: Node, parent: HTMLElement | null): number => {
    const walker = document.createTreeWalker(
        parent || document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
    
      let charCount = 0;
      while (walker.nextNode()) {
        if (walker.currentNode === node) {
          break;
        }
        charCount += walker.currentNode.textContent?.length || 0;
      }
    
      return charCount;
    };


    export const adjustSelectionBounds = (textContent: string, startIndex: number, endIndex: number): { start: number, end: number } => {
      let startAdjustment = 0;
      let endAdjustment = 0;
    
      const reStartIndex = /^[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
      while (!(textContent.charAt(startIndex + startAdjustment - 1) === " " || textContent.charAt(startIndex + startAdjustment - 1).match(reStartIndex)) && textContent.charAt(startIndex + startAdjustment - 1) !== '') {
        startAdjustment -= 1;
      }
    
      const reEndIndex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]$/g;
      while (!(textContent.charAt(endIndex + endAdjustment) === " " || textContent.charAt(endIndex + endAdjustment).match(reEndIndex)) && textContent.charAt(endIndex + endAdjustment) !== '') {
        endAdjustment += 1;
      }
    
      return {
        start: startIndex + startAdjustment,
        end: endIndex + endAdjustment
      };
    };