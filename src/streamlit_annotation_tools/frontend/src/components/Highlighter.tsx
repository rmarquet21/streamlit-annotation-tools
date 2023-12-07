import React, { useReducer, useEffect, useCallback } from "react"
import { Streamlit } from "streamlit-component-lib"
import { useRenderData } from "../utils/StreamlitProvider"
import { initialState, reducer } from "../reducers/highlightReducer"
import {
  isHighlighted,
  removeHighlight,
  getCharactersCountUntilNode,
  adjustSelectionBounds,
} from "../helpers/highlightHelpers"
import { IState, ActionTypes, IAction } from "../types/highlightTypes"

const Highlighter: React.FC = () => {
  const { args } = useRenderData()
  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(
    reducer,
    initialState
  )

  useEffect(() => {
    const fetchData = async () => {
      const { text, highlights } = args
      dispatch({
        type: ActionTypes.SET_TEXT_HIGHLIGHTS,
        payload: { text, highlights },
      })
      dispatch({ type: ActionTypes.RENDER_TEXT })
      Streamlit.setComponentValue(highlights)
    }

    fetchData()
  }, [])

  useEffect(() => {
    dispatch({ type: ActionTypes.RENDER_TEXT })
  }, [state.highlights, state.selectedReference])

  const handleMouseUp = useCallback(async () => {
    const selection = document.getSelection()?.getRangeAt(0)

    if (selection && selection.toString().trim() !== "") {
      const container = document.getElementById("actual-text")
      const charsBeforeStart = getCharactersCountUntilNode(
        selection.startContainer,
        container
      )
      const charsBeforeEnd = getCharactersCountUntilNode(
        selection.endContainer,
        container
      )

      const finalStartIndex = selection.startOffset + charsBeforeStart
      const finalEndIndex = selection.endOffset + charsBeforeEnd

      const textContent = container?.textContent || ""

      const { start, end } = adjustSelectionBounds(
        textContent,
        finalStartIndex,
        finalEndIndex
      )
      const selectedText = textContent.slice(start, end)

      if (
        isHighlighted(
          finalStartIndex,
          finalEndIndex,
          state.highlights[state.selectedReference]
        )
      ) {
        const highlights = removeHighlight(
          start,
          end,
          state.highlights[state.selectedReference]
        )
        const newHighlights = [...state.highlights]
        newHighlights[state.selectedReference] = highlights
        dispatch({
          type: ActionTypes.SET_TEXT_HIGHLIGHTS,
          payload: { text: state.text, highlights: newHighlights },
        })
      } else {
        const newHighlight = { start, end, label: selectedText }
        const newHighlights = [...state.highlights]
        newHighlights[state.selectedReference] = [
          ...newHighlights[state.selectedReference],
          newHighlight,
        ]
        dispatch({
          type: ActionTypes.SET_TEXT_HIGHLIGHTS,
          payload: { text: state.text, highlights: newHighlights },
        })
      }
    }
  }, [state, dispatch])

  const addReference = () => {
    dispatch({ type: ActionTypes.ADD_REFERENCE })
  }

  const selectReference = (index: number) => {
    dispatch({ type: ActionTypes.SELECT_REFERENCE, payload: index })
  }

  const removeReference = (index: number) => {
    dispatch({ type: ActionTypes.REMOVE_REFERENCE, payload: index })
  }

  return (
    <div>
      <div className="flex flex-row flex-wrap">
        <div
          className="flex flex-wrap justify-between items-center cursor-pointer py-1 px-3 mr-2 mb-2 rounded text-white text-base bg-primary hover:bg-secondary"
          onClick={addReference}
        >
          <span>+</span>
        </div>
        {state.highlights.map((reference, index) => (
          <span
            key={index}
            className={
              "flex flex-wrap justify-between items-center cursor-pointer py-1 px-3 mr-2 mb-2 rounded text-base" +
              (state.selectedReference === index
                ? " bg-primary hover:bg-secondary text-white"
                : " border border-primary text-primary hover:bg-primary hover:text-white")
            }
            onClick={() => selectReference(index)}
          >
            {reference[0]?.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-3 hover:text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={() => removeReference(index)}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              />
            </svg>
          </span>
        ))}
      </div>
      <div id="actual-text" className="mt-5 h-full" onMouseUp={handleMouseUp}>
        {state.actual_text}
      </div>
    </div>
  )
}

export default Highlighter
