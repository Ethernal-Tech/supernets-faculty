import { useContext, useCallback, useEffect, useMemo } from 'react';
import { Subtract } from 'utility-types';
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer';
import { FieldMessage } from '../addons/FieldMessage/FieldMessage';
import { FormContext, IFormContext, ValidatorFunctionType } from '../Form';
import { InputProps, SelectProps } from '../controls';
import { isRequiredValidator, isEmailValidator, isPositiveIntegerValidator } from '../validators';

export type ControlsCommonProps<P> = {
	value?: P
	onChange?(value: P): void
	onBlur?(): void
	disabled?: boolean
}

export type FieldProps = {
	id: string
	label?: string
	isRequired?: boolean
	isEmail?: boolean
	isPositiveInteger?: boolean
	validators?: Array<ValidatorFunctionType>
	disabled?: boolean
	inline?: boolean
	multiline?: boolean
}

type Props = FieldProps & Subtract<(SelectProps | InputProps), ControlsCommonProps<any>> & {
	Control: any
}

export const Field = ({ id, label, isRequired, isEmail, isPositiveInteger, validators, disabled, inline, multiline, Control, ...rest }: Props) => {
	const context = useContext<IFormContext>(FormContext);
	const registerValidatorsInContext = context.registerValidators; // eslint is complaining (in useEffect dependencies) when using context.registerValidators

	// register validators in FormContext, so Form has access to it
	useEffect(
		() => {
			let validatorsToRegister: ValidatorFunctionType[] = []
			isRequired && validatorsToRegister.push(isRequiredValidator);
			isEmail && validatorsToRegister.push(isEmailValidator);
			isPositiveInteger && validatorsToRegister.push(isPositiveIntegerValidator)
			validators && validatorsToRegister.push(...validators);

			registerValidatorsInContext && registerValidatorsInContext(id, validatorsToRegister)
			return () => {
				registerValidatorsInContext && registerValidatorsInContext(id, [])
			}
		},
		[id, validators, isRequired, isEmail, isPositiveInteger, registerValidatorsInContext]
	)

	const onChangeCallback = useCallback(
		(value) => context.onFieldChange && context.onFieldChange(id, value),
		[id, context]
	)

	const onBlurCallback = useCallback(
		() => context.validateField && context.validateField(id),
		[id, context]
	)

	const controlContent = useMemo(
		() => (
			<Control
				value={context.values[id]}
				onChange={onChangeCallback}
				onBlur={onBlurCallback}
				disabled={disabled || context.disabled}
				{...rest}
			/>
		),
		[context.disabled, context.values, onChangeCallback, onBlurCallback, disabled, id, rest, Control]
	)

	const content = useMemo(
		() => {
			if (inline) {
				return (
					<>
						{controlContent}
						<FieldMessage message={context.errors[id]} />
					</>
				);
			} else {
				return (
					<SmartFormGroup label={label} isRequired={isRequired} multiline={multiline}>
						{controlContent}
						<FieldMessage message={context.errors[id]} />
					</SmartFormGroup>
				)
			}
		},
		[inline, controlContent, label, isRequired, id, context.errors, multiline]
	)

	return (
		<>{content}</>
	)
}
