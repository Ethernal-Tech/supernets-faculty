export function decodeQueryString(url) {
    const question = url.indexOf('?')
    const hash = url.indexOf('#')
    if (question === -1) {
        return {}
    }
    // @see https://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
    // hash should not be used as params in our case
    const query = hash !== -1 ? url.substring(question + 1, hash) : url.substring(question + 1)
    const result = query.split('&').filter(x => !!x).reduce(function (params, part) {
        part = part.split('+').join(' ') // replace every + with space, regexp-free version
        const eq = part.indexOf('=')
        let key = eq > -1 ? part.substring(0, eq) : part
        const value = eq > -1 ? decodeURIComponent(part.substring(eq + 1)) : ''
        const from = key.indexOf('[')
        if (from === -1) {
            params[decodeURIComponent(key)] = value
        }
        else {
            const to = key.indexOf(']', from)
            key = decodeURIComponent(key.substring(0, from))
            if(!params[key]) {
                params[key] = []
            }
            const index = decodeURIComponent(key.substring(from + 1, to))
            if (index === '') {
                params[key].push(value)
            }
            else {
                params[key][index] = value
            }
        }
        return params
    }, {})
    return result
}

export function parametersToQueryString(urlParameters, arrayKeySuffix = '') {
    if (!urlParameters || typeof urlParameters !== 'object') {
        return ''
    }

    const urlParametersKeys = Object.keys(urlParameters)
        .filter(key => urlParameters[key] !== null && urlParameters[key] !== undefined)

    if (urlParametersKeys.length === 0) {
        return ''
    }

    const result = urlParametersKeys.map(key => {
        const value = urlParameters[key]
        if (Array.isArray(value)) {
            return value.filter(x => x !== null && x !== undefined)
                .map(arrValue => `${key}${arrayKeySuffix}=${encodeURIComponent(arrValue)}`)
                .join('&')
        }
        return `${key}=${encodeURIComponent(value)}`
    }).join('&')
    return '?' + result
}