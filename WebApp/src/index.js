import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'normalize.css'
import './index.scss'
import 'assets/styles/variables.module.scss'
import 'assets/styles/scrollbar.scss'
import { App } from './App'
import { Provider } from 'react-redux'
import store from './state/store'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
