import { setSelectedAccount, setGasPrice } from '../state/ethReducer'
import web3 from '../web3'
import EventListenerService from "../utils/eventListenerService"

export const initializeEthAction = async (location, navigate, dispatch) => {
    window.ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        if (location && location.pathname !== '/' && location.pathname !== '') {
            navigate('/')
        }
        dispatch(setSelectedAccount(accounts.length > 0 ? accounts[0] : undefined))
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