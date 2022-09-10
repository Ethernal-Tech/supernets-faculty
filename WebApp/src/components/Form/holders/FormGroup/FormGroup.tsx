type Props = {
	title: string
	children: any
}

export const FormGroup = ({ title, children }: Props) => {
	return (
		<>
			<h5>{title}</h5>
			{children}
		</>
	)
}
