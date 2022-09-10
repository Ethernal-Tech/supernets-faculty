import { useReducer } from 'react';
import { ValidatorFunctionType } from './Form';

export const ADD_VALIDATOR_TYPE = 'ADD_VALIDATOR';

type ActionType = {
	type: string
	id: string
	validatorFunctions: Array<ValidatorFunctionType>
}

type StateType = {
	[fieldName: string]: Array<ValidatorFunctionType>
}

const initialState: StateType = {};

function registeredValidatorsReducer(state: any, action: ActionType) {
	switch (action.type) {
		case ADD_VALIDATOR_TYPE:
			return {
				...state,
				[action.id]: action.validatorFunctions
			};
		default:
			return state;
			// throw new Error(`Bad registered validators reducer action type: ${action.type}`);
	}
}

export const useRegisteredValidatorsReducer = (): [StateType, React.Dispatch<ActionType>] => {
	return useReducer(registeredValidatorsReducer, initialState);
}
