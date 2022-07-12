import { setSelectedAccount, setGasPrice } from '../state/ethReducer'
import web3 from '../web3'

export const initializeEthAction = async (location, navigate, dispatch) => {
    window.ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        if (location && location.pathname !== '/' && location.pathname !== '') {
            navigate('/')
        }
        dispatch(setSelectedAccount(accounts.length > 0 ? accounts[0] : undefined))
    });

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        dispatch(setSelectedAccount(accounts[0]))
    }

    const gasPrice = await web3.eth.getGasPrice();
    dispatch(setGasPrice(gasPrice))
}