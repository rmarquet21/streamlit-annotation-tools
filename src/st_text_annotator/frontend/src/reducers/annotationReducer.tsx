import React from 'react';
import { IState, IAction, ActionTypes } from '../types';
import { Streamlit } from 'streamlit-component-lib';

// Define the initial state of the component
export const initialState: IState = {
  text: "",
  actual_text: [],
  annotations: [],
  selectedReference: 0,
};

// Reducer function to handle state transitions
export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.SET_TEXT_ANNOTATIONS:
      // Set the text and annotations
      Streamlit.setComponentValue(action.payload.annotations);
      return {
        ...state,
        text: action.payload.text,
        annotations: action.payload.annotations,
      };

    case ActionTypes.RENDER_TEXT:
      // Logic to render text with annotations
      const { text, annotations } = state;
      const actual_text: JSX.Element[] = [];
      let start = 0;
      let selectedReference = state.selectedReference;
      
      if (!annotations[selectedReference]) {
        selectedReference = 0;
        if (!annotations[selectedReference]) {
          annotations[selectedReference] = [];
        }
      }

      annotations[selectedReference]?.sort((a, b) => a.start - b.start).forEach((annotation, index) => {
        actual_text.push(<span key={`unannotated-${index}`}>{text.substring(start, annotation.start)}</span>);
        actual_text.push(
          <span key={`annotated-${index}`} className="annotated bg-blue-500 text-gray-100">
            {text.substring(annotation.start, annotation.end)}
          </span>
        );
        start = annotation.end;
      });
      actual_text.push(<span key="unannotated-end">{text.substring(start)}</span>);
      Streamlit.setComponentValue(annotations);
      return {
        ...state,
        actual_text,
        selectedReference,
      };

    case ActionTypes.ADD_REFERENCE:
      // Add a new reference
      const newAnnotations = [...state.annotations];
      const newIndex = newAnnotations.length;
      newAnnotations.push([]);

      return {
        ...state,
        annotations: newAnnotations,
        selectedReference: newIndex,
      };

    case ActionTypes.SELECT_REFERENCE:
      return {
        ...state,
        selectedReference: action.payload,
      };

    case ActionTypes.REMOVE_REFERENCE:
      const updatedAnnotations = [...state.annotations];
      updatedAnnotations.splice(action.payload, 1);
      return {
        ...state,
        annotations: updatedAnnotations,
        selectedReference: 0,
      };

    default:
      return state;
  }
};
