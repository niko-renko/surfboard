import React from 'react';
import Box from '@mui/material/Box';

import Base from '../Base';

import PDF from '../components/PDF';
import Chat from '../components/Chat';
import Agenda from '../components/Agenda';
import PresenterMenu from '../components/PresenterMenu';
import ViewerMenu from '../components/ViewerMenu';

class App extends Base
{
    static styles = {
        app: {
            width: '1536px',
            height: '753.6px',
            margin: '-8px',
            display: 'grid',
            gridTemplateColumns: '8fr 2fr',
            gridTemplateRows: '9fr 1fr',
            gridTemplateAreas: `
                "pdf sidebar"
                "menu sidebar"
            `
        },
        pdf: {
            gridArea: 'pdf',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        },
        sidebar: {
            gridArea: 'sidebar',
            borderLeft: '1px solid black',
            background: 'black'
        },
        menu: {
            gridArea: 'menu',
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid black'
        }
    };

    state = {
    };

    render = () => {
        if(!this.props.presenting)
            return <></>;

        const sidebar = this.props.chat ? <Chat /> : <Agenda />;
        const menu = this.props.presenter ? <PresenterMenu /> : <ViewerMenu />;

        return (
            <Box className={this.props.classes.app} >
                <Box className={this.props.classes.pdf} >
                    <PDF />
                 </Box>
                <Box className={this.props.classes.sidebar} >
                    {sidebar}
                </Box>
                <Box className={this.props.classes.menu} >
                    {menu}
                </Box>
            </Box>
        );
    };
}

export default App.export;