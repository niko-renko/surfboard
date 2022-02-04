import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import Base from './Base';

import Home from './views/Home';
import Present from './views/Present';
import Join from './views/Join';
import Presentation from './views/Presentation';

class App extends Base
{
    static styles = {
        app: {
            width: '1536px',
            height: '753.6px',
            margin: '-8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        spinner: {
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100vw',
            height: '100vh',
            zIndex: 100,
            background: 'grey',
            opacity: '0.3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    };

    api = async request => {
        const ws = await this.ws;

        const id = uuid();

        const handler = (
            message,
            resolve
        ) => {
            try
            {
                message = JSON.parse(message.data);
            }
            catch(error)
            {
                return;
            }

            if(message.id === id)
                return resolve(message);

            return;
        };

        const responsePromise = new Promise(
            resolve => ws.addEventListener(
                'message',
                message => handler(message, resolve)
            )
        );

        const timeoutPromise = new Promise(
            (
                resolve,
                reject
            ) => setTimeout(
                () => reject('timeout'),
                1000
            )
        );

        ws.send(
            JSON.stringify(
                {
                    id,
                    ...request
                }
            )
        );

        const response = await Promise.race(
            [
                responsePromise,
                timeoutPromise
            ]
        );

        ws.removeEventListener(
            'message',
            handler
        );

        return response;
    };

    open = async ws => {
        // Update state
        this.props.dispatch(
            {
                type: 'setConnected',
                connected: true
            }
        );

        return ws;
    };

    close = async ws => {
        // Update state
        this.props.dispatch(
            {
                type: 'setConnected',
                connected: false
            }
        );

        // Wait
        await new Promise(
            resolve => setTimeout(
                resolve,
                3000
            )
        );

        // Reconnect
        return this.connect();
    };

    connect = () => this.ws = new Promise(
        resolve => {
            const ws = new WebSocket('ws://localhost:8081');

            ws.addEventListener(
                'open',
                () => resolve(
                    this.ws = this.open(ws)
                )
            );

            ws.addEventListener(
                'close',
                () => resolve(
                    this.ws = this.close(ws)
                )
            );

            return;
        }
    );

    state = {
        connected: false
    };

    componentDidMount = async () => {
        // this.ws always eventually
        // resolves to a connection

        // TODO: connect to depend on auth
        // possibly through a simpler auth process

        this.connect();

        const {
            user
        } = await this.api(
            {
                action: 'auth',
                userID: localStorage.getItem('userID')
            }
        );

        this.props.dispatch(
            {
                type: 'setUser',
                user
            }
        );

        this.props.dispatch(
            {
                type: 'setAPI',
                api: this.api
            }
        );

        localStorage.setItem(
            'userID',
            user.id
        );

        return;
    };

    render = () => {
        const spinner = (
            <Box className={this.props.classes.spinner}>
                <CircularProgress/>
            </Box>
        );

        // Temp fix of auth and connection being separate
        if(!this.props.user)
            return spinner;

        return (
            <Box className={this.props.classes.app}>
                {this.props.connected ? null : spinner}
                <Routes>
                    <Route
                        path='/'
                        element={<Home />}
                    />
                    <Route
                        path='/present'
                        element={<Present />}
                    />
                    <Route
                        path='/join'
                        element={<Join />}
                    />
                    <Route
                        path='/presentation'
                        element={<Presentation />}
                    />
                </Routes>
            </Box>
        );
    };
}

export default App.export;