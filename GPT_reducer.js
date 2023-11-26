// make sure to get the correct paths
import * as actionTypes from '../constants/actionTypes';
import {updateObject} from '../constants/utility';

// change gptEnabled to false to dissallow gpt to be used in frontend
const initialState = {
  gptEnabled: true,
  gptResponseLoading: false,
  gptResponses: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case to add item to the array of gptResponses
    case actionTypes.GPT_CONTROLS:
      console.log('this is the action payload: ', action.payload);

      return {
        ...state,
        gptResponseLoading: false,
        gptResponses: state.gptResponses.concat(action.payload.gptResponses),
      };

    // cast to delete a entry in gptResponses
    case actionTypes.GPT_CORRUPTED:
      return {
        ...state,
        gptResponseLoading: false,
        gptResponses: state.gptResponses.filter(
          item => item.id !== action.payload,
        ),
      };

    // case to set loading state
    case actionTypes.GPT_LOADING:
      return {
        ...state,
        gptResponseLoading: action.payload.gptResponseLoading,
      };
    default:
      return state;
  }
};

export default reducer;
