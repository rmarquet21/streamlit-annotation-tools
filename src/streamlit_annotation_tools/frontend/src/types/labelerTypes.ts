export enum ActionTypes {
    SET_TEXT_LABELS = 'SET_TEXT_LABELS',
    RENDER_TEXT = 'RENDER_TEXT',
    ADD_LABEL = 'ADD_LABEL',
    SELECT_LABEL = 'SELECT_LABEL',
    REMOVE_LABEL = 'REMOVE_LABEL',
}

export type ILabel = {
    start: number;
    end: number;
    label: string;
}

export interface IState {
    text: string;
    actual_text: JSX.Element[];
    selectedLabel: string;
    labels: { [key: string]: ILabel[]};
    in_snake_case: boolean;
}

export interface IAction {
    type: ActionTypes;
    payload?: any;
  }