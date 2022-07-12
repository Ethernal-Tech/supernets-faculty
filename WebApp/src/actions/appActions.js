import { setSelectedAccount, setGasPrice } from '../state/ethReducer'
import web3 from '../web3'
import EventListenerService from "../utils/eventListenerService"

export const initializeEthAction = async (navigate, dispatch) => {
    window.ethereum.on('accountsChanged', async _ => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.

        // accounts param returns all lowercase, so we fetch like this
        const accounts = await web3.eth.getAccounts();
        dispatch(setSelectedAccount(accounts.length > 0 ? accounts[0] : undefined))
        const pathname = window.location ? window.location.pathname  : ''
        if (pathname !== '/' && pathname !== '') {
            navigate('/')
        }        
    })

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }

    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            dispatch(setSelectedAccount(accounts[0]))
        }
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }

    try {
        const gasPrice = await web3.eth.getGasPrice();
        dispatch(setGasPrice(gasPrice))
    } catch (ex) {
        EventListenerService.notify("error", ex)
    }    
}