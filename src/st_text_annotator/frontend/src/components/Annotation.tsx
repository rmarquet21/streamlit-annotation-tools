import React, { useReducer, useEffect, useCallback } from "react";
import { Streamlit } from "streamlit-component-lib";
import { useRenderData } from "../utils/StreamlitProvider";
import { initialState, reducer } from '../reducers/annotationReducer';
import { isAnnotated, removeAnnotation, getCharactersCountUntilNode, adjustSelectionBounds } from '../helpers/annotationHelpers';
import { IState, ActionTypes, IAction } from '../types';

const Annotation: React.FC = () => {
  const { args } = useRenderData();
  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      const { text, annotations } = args;
      dispatch({ type: ActionTypes.SET_TEXT_ANNOTATIONS, payload: { text, annotations } });
      dispatch({ type: ActionTypes.RENDER_TEXT });
      Streamlit.setComponentValue(annotations);
    };

    fetchData();
  }, []);

  useEffect(() => {
    dispatch({ type: ActionTypes.RENDER_TEXT });
  }, [state.annotations, state.selectedReference]);

  const handleMouseUp = useCallback(async () => {
    const selection = document.getSelection()?.getRangeAt(0);

    if (selection && selection.toString().trim() !== "") {
      const container = document.getElementById("actual-text");
      const charsBeforeStart = getCharactersCountUntilNode(selection.startContainer, container);
      const charsBeforeEnd = getCharactersCountUntilNode(selection.endContainer, container);

      const finalStartIndex = selection.startOffset + charsBeforeStart;
      const finalEndIndex = selection.endOffset + charsBeforeEnd;

      const textContent = container?.textContent || "";

      const { start, end } = adjustSelectionBounds(textContent, finalStartIndex, finalEndIndex);
      const selectedText = textContent.slice(start, end);

      if (isAnnotated(finalStartIndex, finalEndIndex, state.annotations[state.selectedReference])) {
        const annotations = removeAnnotation(start, end, state.annotations[state.selectedReference]);
        const newAnnotations = [...state.annotations];
        newAnnotations[state.selectedReference] = annotations;
        dispatch({ type: ActionTypes.SET_TEXT_ANNOTATIONS, payload: { text: state.text, annotations: newAnnotations } });
      } else {
        const newAnnotation = { start, end, label: selectedText };
        const newAnnotations = [...state.annotations];
        newAnnotations[state.selectedReference] = [...newAnnotations[state.selectedReference], newAnnotation]; // Add the new annotation
        dispatch({ type: ActionTypes.SET_TEXT_ANNOTATIONS, payload: { text: state.text, annotations: newAnnotations } });
      }
    }
  }, [state, dispatch]);

  const addReference = () => {
    dispatch({ type: ActionTypes.ADD_REFERENCE });
  };

  const selectReference = (index: number) => {
    dispatch({ type: ActionTypes.SELECT_REFERENCE, payload: index });
  };

  const removeReference = (index: number) => {
    dispatch({ type: ActionTypes.REMOVE_REFERENCE, payload: index });
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap">
        <div
          className="flex flex-wrap px-4 py-2 m-1 justify-between items-center text-sm font-medium cursor-pointer hover:bg-blue-600 hover:text-gray-100 bg-blue-500 text-gray-100"
          onClick={addReference}
        >
          <span>Add</span>
        </div>
        {state.annotations.map((reference, index) => (
          <span
            key={index}
            className={"flex flex-wrap pl-4 pr-2 py-2 m-1 justify-between items-center text-sm font-medium cursor-pointer hover:bg-blue-600 hover:text-gray-100" + (state.selectedReference === index ? " bg-blue-500 text-gray-100" : " bg-blue-900 text-gray-200")}
            onClick={() => selectReference(index)}
          >
            {reference[0]?.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-3 hover:text-gray-300" viewBox="0 0 20 20"
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
  );
};

export default Annotation;
