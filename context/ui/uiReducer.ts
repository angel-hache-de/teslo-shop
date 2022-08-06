import { UIState } from "./";

type UIActionType = {
  type: "UI - ToggleMenu";
};

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case "UI - ToggleMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
      break;
    default:
      return state;
  }
};
