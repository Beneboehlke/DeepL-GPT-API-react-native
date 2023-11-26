// make sure to use the right paths for your project
import instance from '../../utils/AxiosInstance';
import * as actionTypes from '../constants/actionTypes';

// action to get the context from the backend
export const getGptContext = (query, id) => {
  return async dispatch => {
    try {
      // !! make sure to choose the right route to the specific endponínt in your backend !!
      let response = await instance.post('/openai/request', {
        params: {
          query,
        },
      });

      let dataGPT = JSON.parse(response.data);
      let dataReturn = {id: id, content: dataGPT};

      dispatch({
        type: actionTypes.GPT_CONTROLS,
        payload: {gptResponseLoading: false, gptResponses: dataReturn},
      });
    } catch (error) {
      console.log('there was an error in GPT.js ', error);
      dataReturnError = {
        id: id,
      };
      //errorHandler(error);
      dispatch({
        type: actionTypes.GPT_CONTROLS,
        payload: {gptResponseLoading: false, gptResponses: dataReturnError},
      });
    }
  };
};

// delete a store entry if its corrupted
export const deleteGPTItem = id => {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.GPT_CORRUPTED,
        payload: id,
      });
    } catch (error) {
      console.log(
        'there was an error in GPT.js deleting the corrupted item ',
        error,
      );
      //errorHandler(error);
    }
  };
};

// sets to loading state in the store
export const loadingGptItem = loadingStatus => {
  return {
    type: actionTypes.GPT_LOADING,
    payload: {gptResponseLoading: loadingStatus},
  };
};
