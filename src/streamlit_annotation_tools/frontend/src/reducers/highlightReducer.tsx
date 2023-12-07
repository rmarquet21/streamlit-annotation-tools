import React from "react"
import { IState, IAction, ActionTypes } from "../types/highlightTypes"
import { Streamlit } from "streamlit-component-lib"

// Define the initial state of the component
export const initialState: IState = {
  text: "",
  actual_text: [],
  highlights: [],
  selectedReference: 0,
}

// Reducer function to handle state transitions
export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.SET_TEXT_HIGHLIGHTS:
      // Set the text andhighlight
      Streamlit.setComponentValue(action.payload.highlights)
      return {
        ...state,
        text: action.payload.text,
        highlights: action.payload.highlights,
      }

    case ActionTypes.RENDER_TEXT:
      // Logic to render text withhighlight
      const { text, highlights } = state
      const actual_text: JSX.Element[] = []
      let start = 0
      let selectedReference = state.selectedReference

      if (!highlights[selectedReference]) {
        selectedReference = 0
        if (!highlights[selectedReference]) {
          highlights[selectedReference] = []
        }
      }

      highlights[selectedReference]
        ?.sort((a, b) => a.start - b.start)
        .forEach((highlight, index) => {
          actual_text.push(
            <span key={`unhighlighted-${index}`}>
              {text.substring(start, highlight.start)}
            </span>
          )
          actual_text.push(
            <span
              key={`highlighted-${index}`}
              className="highlighted border border-primary bg-primary/20"
            >
              {text.substring(highlight.start, highlight.end)}
            </span>
          )
          start = highlight.end
        })
      actual_text.push(
        <span key="highlighted-end">{text.substring(start)}</span>
      )
      Streamlit.setComponentValue(highlights)
      return {
        ...state,
        actual_text,
        selectedReference,
      }

    case ActionTypes.ADD_REFERENCE:
      // Add a new reference
      const newHighlights = [...state.highlights]
      const newIndex = newHighlights.length
      newHighlights.push([])

      return {
        ...state,
        highlights: newHighlights,
        selectedReference: newIndex,
      }

    case ActionTypes.SELECT_REFERENCE:
      return {
        ...state,
        selectedReference: action.payload,
      }

    case ActionTypes.REMOVE_REFERENCE:
      const updatedHighlights = [...state.highlights]
      updatedHighlights.splice(action.payload, 1)
      return {
        ...state,
        highlights: updatedHighlights,
        selectedReference: 0,
      }

    default:
      return state
  }
}
