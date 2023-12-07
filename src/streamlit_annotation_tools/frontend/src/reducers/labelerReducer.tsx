import { Streamlit } from "streamlit-component-lib"
import { ActionTypes, IAction, IState } from "../types/labelerTypes"
import React from "react"
import { formatKeys } from "../helpers/labelerHelpers"

// Define the initial state of the component
export const initialState: IState = {
  text: "",
  actual_text: [],
  labels: {},
  selectedLabel: "",
  in_snake_case: false,
}

// Reducer function to handle state transitions
export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.SET_TEXT_LABELS:
      Streamlit.setComponentValue(formatKeys(action.payload.labels, action.payload.in_snake_case))

      return {
        ...state,
        in_snake_case: action.payload.in_snake_case,
        text: action.payload.text,
        labels: action.payload.labels,
      }

    case ActionTypes.RENDER_TEXT:
      const { text, labels } = state
      const actual_text: JSX.Element[] = []
      let start = 0
      let selectedLabel = state.selectedLabel

      if (!selectedLabel) {
        if (Object.keys(labels).length > 0) {
          selectedLabel = Object.keys(labels)[0]
        } else {
          return {
            ...state,
            actual_text: [<p key={"default-text"}>{text}</p>]
          }
        }
      }

      if (!labels[selectedLabel]) {
        selectedLabel = Object.keys(labels)[Object.keys(labels).length - 1]
      }

      labels[selectedLabel]
        ?.sort((a, b) => a.start - b.start)
        .forEach((label, index) => {
          actual_text.push(
            <span key={`unlabeled-${index}`}>
              {text.substring(start, label.start)}
            </span>
          )
          actual_text.push(
            <span
              key={`labeled-${index}`}
              className="labeled border border-primary bg-primary/20"
            >
              {text.substring(label.start, label.end)}
            </span>
          )
          start = label.end
        })
      actual_text.push(
        <span key="unlabeled-end">{text.substring(start)}</span>
      )
      Streamlit.setComponentValue(formatKeys(labels, state.in_snake_case))
      return {
        ...state,
        actual_text,
        selectedLabel,
      }

    case ActionTypes.ADD_LABEL:
      const newLabels = { ...state.labels }
      // strip whitespace
      newLabels[action.payload.trim()] = []

      return {
        ...state,
        labels: newLabels,
        selectedLabel: action.payload,
      }

    case ActionTypes.SELECT_LABEL:
      return {
        ...state,
        selectedLabel: action.payload,
      }

    case ActionTypes.REMOVE_LABEL:
      const updatedLabels = { ...state.labels }
      delete updatedLabels[action.payload]

      return {
        ...state,
        labels: updatedLabels
      }

    default:
      return state
  }
}
