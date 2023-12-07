export interface IReference {
    start: number;
    end: number;
    label: string;
}

export interface IState {
  text: string;
  actual_text: JSX.Element[];
  selectedReference: number;
  highlights: IReference[][];
}

export enum ActionTypes {
  SET_TEXT_HIGHLIGHTS = 'SET_TEXT_HIGHLIGHTS',
  RENDER_TEXT = 'RENDER_TEXT',
  ADD_REFERENCE = 'ADD_REFERENCE',
  SELECT_REFERENCE = 'SELECT_REFERENCE',
  REMOVE_REFERENCE = 'REMOVE_REFERENCE',
}

export interface IAction {
  type: ActionTypes;
  payload?: any;
}
