import { useReducer, useEffect } from "react";
import { Streamlit, RenderData } from "streamlit-component-lib";

// Define action types
enum ActionTypes {
  SET_RENDER_DATA = 'SET_RENDER_DATA',
}

// Define action interface
interface Action {
  type: ActionTypes;
  payload: RenderData;
}

// Define reducer function
const reducer = (state: RenderData | undefined, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_RENDER_DATA:
      return action.payload;
    default:
      return state;
  }
};

/**
 * Returns `RenderData` received from Streamlit after the first render event received.
 */
export const useNullableRenderData = (): RenderData | undefined => {
  const [renderData, dispatch] = useReducer(reducer, undefined);

  useEffect(() => {
    const onRenderEvent = (event: Event): void => {
      const renderEvent = event as CustomEvent<RenderData>;
      dispatch({ type: ActionTypes.SET_RENDER_DATA, payload: renderEvent.detail });
    };

    // Set up event listeners, and signal to Streamlit that we're ready.
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRenderEvent);
    Streamlit.setComponentReady();

    const cleanup = () => {
      Streamlit.events.removeEventListener(Streamlit.RENDER_EVENT, onRenderEvent);
    };
    return cleanup;
  }, []);

  return renderData;
};
