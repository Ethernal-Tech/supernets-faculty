import React from 'react'
import { useLocation } from 'react-router-dom'
import { decodeQueryString } from './urlQueryUtils'

function withRouter(SomeReactComponent) {
    const HocClass = function(props) {
        const location = useLocation()
        const params = location?.search ? decodeQueryString(location.search) : {}
        return (
            <SomeReactComponent
                {...props}
                location={location}
                {...params}
            />
        )
    }
    return HocClass
}

export default withRouter
