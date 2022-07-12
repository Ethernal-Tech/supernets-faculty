const listenersByEvent = { }

function subscribe(eventName, callback, callOnce) {
    // TODO: currently tests does not run with default parameters
    callOnce = callOnce || false
    const newListener = {
        event: eventName,
        callback,
        callOnce,
        remove: function() {
            if (this.event in listenersByEvent) {
                const newList = listenersByEvent[this.event].filter(x => x.callback !== this.callback)
                if (newList.length) {
                    listenersByEvent[this.event] = newList
                }
                else {
                    delete listenersByEvent[this.event]
                }
            }
        }
    }
    if (!(eventName in listenersByEvent)) {
        listenersByEvent[eventName] = []
    }
    listenersByEvent[eventName].push(newListener)
    return newListener
}

function notify(eventName, data) {
    if (eventName in listenersByEvent) {
        const listeners = listenersByEvent[eventName]
        const successResults = listeners.map(x => x.callback(data))
        removeCalledListeners(eventName, successResults)
    }
}

// currently tests does not resolve async
function notifyAsync(eventName, data) {    
    return new Promise(function (resolve, reject) {
        if (eventName in listenersByEvent) {
            const listeners = listenersByEvent[eventName]
            const promises = listeners.map(x => x.callback(data))
            Promise.all(promises).then(function (successResults) {
                removeCalledListeners(eventName, successResults)
                resolve(true)
            }).catch(function (error) {
                // please handle exceptions in callbacks, otherwise it is possible
                // for some callOnce callback in listenersByEvent to be called multiple times
                reject(error)
            })   
        }
        else {
            resolve(true)
        }
    })
}

const listener = {
    subscribe,
    notify,
    notifyAsync,
}
export default listener

function removeCalledListeners(eventName, successResults) {
    const listeners = listenersByEvent[eventName]
    if (listeners) {
        listenersByEvent[eventName] = listeners.filter((x, index) => !x.callOnce || successResults[index] === false)
    }
}