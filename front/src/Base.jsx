import React from 'react';

import withStyles from '@mui/styles/withStyles';
import { connect } from 'react-redux';

class Base extends React.Component
{
    static styles = {
    };

    update = action => this.setState(
        state => (
            {
                ...state,
                ...action
            }
        )
    );

    static get export()
    {
        const connected = connect(state => state)(this);
        const styled = withStyles(this.styles)(connected);

        return styled;
    }
}

export default Base;