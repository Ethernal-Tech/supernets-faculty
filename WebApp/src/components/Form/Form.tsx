import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'components/Button';
import { ColumnContainer, RowContainer } from 'components/Layout';
import { FieldMessage } from './addons';
import { ADD_VALIDATOR_TYPE, useRegisteredValidatorsReducer } from './useRegisteredValidatorsReducer';

// when there is some validation problem on form, that is not strictly on one field, backend is sending it thru property with id ''
export const globalErrorKey = '';

export type ValidatorFunctionType = (value: any, values: any, id: string) => any;

export interface IFormContext {
	// TODO: try to set type to those two any's, also on errors in Form -> useState
	values?: any
	errors?: any
	onFieldChange?: (id: string, value: any) => void
	validateField?: (id: string, value?: any) => void
	disabled?: boolean
	registerValidators?(id: string, validatorFunctions: Array<ValidatorFunctionType>): void
	setFieldValue?(id: string, fieldValue: any): void
	setFieldError?(id: string, fieldError: any): void
}

export const FormContext = React.createContext<IFormContext>({});

type KeyValue = {
	[key: string]: any
}

type Props = {
	values: KeyValue
	onChange(values: KeyValue): void
	render(): any
	disabled?: boolean

	// TODO: onSubmit can have better return type, more strict type
	onSubmit?(): KeyValue
	submitButtonText?: string
	hideSubmitButton?: boolean
	onCancel?(): void
	cancelButtonText?: string
	hideCancelButton?: boolean
	renderAdditionalButtons?(disabled?: boolean, handleSubmitCallback?: () => void, isSubmitting?: boolean): any
	hideButtons?: boolean
}

export const Form = ({
	values,
	onChange: onChangeProp,
	render,
	disabled,
	onSubmit,
	submitButtonText = 'Save',
	hideSubmitButton,
	onCancel,
	cancelButtonText = 'Cancel',
	hideCancelButton,
	renderAdditionalButtons,
	hideButtons
}: Props) => {
	// errors.someField can be both undefined
	const [errors, setErrors] = useState<any>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [registeredValidators, dispatchRegisteredValidators] = useRegisteredValidatorsReducer();

	// TODO: try to improve it, so there is undefined (or no property at all) instead of ''
	const haveErrorsCallback = useCallback(
		() => {
			let haveError: boolean = false;
			Object.keys(errors).map((key: string) => {
				// TableField - object[]
				if (errors[key] instanceof Array) {
					for (const rowErrors of errors[key]) {
						if (!rowErrors) {
							continue;
						}
						const keys = Object.keys(rowErrors);
						const firstKey = keys[0];

						if (keys.length !== 1 || firstKey !== globalErrorKey) {
							haveError = true;
							break;
						}
					}
				// other fields - string
				} else if (errors[key].length > 0 && key !== globalErrorKey) {
					haveError = true;
				}
				return null; // just for eslint
			});
			return haveError;
		},
		[errors]
	)

	const validateFieldCallback = useCallback(
		(id: string, value?: any) => {
			let newError: string = '';
			const currentValue = value || values[id];

			for (const validator of registeredValidators[id] || []) {
				newError = validator(currentValue, { ...values, [id]: value}, id)
				if (newError) {
					break;
				}
			}

			setErrors((state: any) => {
				return {
					...state,
					[id]: newError
				}
			});

			return newError === '';
		},
		[values, registeredValidators]
	)

	const validateFormCallback = useCallback(
		() => {
			let valid = true;

			for (const fieldName of Object.keys(registeredValidators)) {
				valid = validateFieldCallback(fieldName) && valid;
			}

			return valid;
		},
		[registeredValidators, validateFieldCallback]
	)

	const handleSubmitCallback = useCallback(
		async (): Promise<void> => {
			setIsSubmitting(true);

			if (validateFormCallback() && onSubmit) {
				let serverErrors = await onSubmit();

				setErrors(serverErrors || {});
			}

			setIsSubmitting(false);
		},
		[validateFormCallback, onSubmit]
	)

	const handleCancelCallback = useCallback(
		() => onCancel && onCancel(),
		[onCancel]
	)

	const onFieldChangeCallback = useCallback(
		(id: string, value: any) => {
			onChangeProp({
				...values,
				[id]: value !== "" ? value : undefined
			})

			// if changed field has error, validate it to check if that error is solved
			if (errors[id]) {
				validateFieldCallback(id, value);
			}
		},
		[validateFieldCallback, errors, values, onChangeProp]
	)

	const registerValidatorsCallback = useCallback(
		(id: string, validatorFunctions: Array<ValidatorFunctionType>) => {
			dispatchRegisteredValidators({
				type: ADD_VALIDATOR_TYPE,
				id,
				validatorFunctions
			})
		},
		[dispatchRegisteredValidators]
	);

	const context: IFormContext = useMemo(
		() => {
			return {
				values,
				errors,
				onFieldChange: onFieldChangeCallback,
				validateField: validateFieldCallback,
				disabled,
				registerValidators: registerValidatorsCallback
			}
		},
		[values, errors, validateFieldCallback, onFieldChangeCallback, disabled, registerValidatorsCallback]
	)

	const handleKeyUp = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				if (e.target && (e.target as any).type === 'textarea') {
					return;
				}

				e.stopPropagation();

				if (disabled || isSubmitting || haveErrorsCallback()) {
					return;
				}

				handleSubmitCallback();
			}
		},
		[disabled, handleSubmitCallback, haveErrorsCallback, isSubmitting]
	)

	return (
		<FormContext.Provider value={context}>
			<ColumnContainer>
				<div onKeyUp={handleKeyUp}>
					{render()}
				</div>

				{context.errors[globalErrorKey] &&
					<RowContainer justifyContent='flex-end'>
						<FieldMessage message={context.errors[globalErrorKey]} />
					</RowContainer>
				}

				{!hideButtons &&
					<RowContainer justifyContent='flex-end'>
						{!hideSubmitButton &&
							<Button
								text={submitButtonText}
								onClick={handleSubmitCallback}
								disabled={disabled || haveErrorsCallback()}
								isLoading={isSubmitting}
							/>
						}
						{renderAdditionalButtons && renderAdditionalButtons(isSubmitting || disabled, handleSubmitCallback, isSubmitting)}
						{!hideCancelButton &&
							<Button
								text={cancelButtonText}
								color='neutral'
								disabled={disabled}
								onClick={handleCancelCallback}
							/>
						}
					</RowContainer>
				}
			</ColumnContainer>
		</FormContext.Provider>
	)
}
