import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner(props) {
  return (
      <>
          <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
          />
          <span>{props.text || 'Please wait...'}</span>
      </>
  )
}