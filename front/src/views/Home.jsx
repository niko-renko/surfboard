import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import Base from '../Base';

class Home extends Base
{
    static styles = {
        link: {
            textDecoration: 'none',
            color: 'white'
        }
    };

    render = () => {
        return (
            <>
                <Button
                    variant='contained'
                >
                    <Link
                        to='/present'
                        className={this.props.classes.link}
                    >
                        Present
                    </Link>
                </Button>
                <Button
                    variant='contained'
                >
                    <Link
                        to='/join'
                        className={this.props.classes.link}
                    >
                        Join Presentation
                    </Link>
                </Button>
            </>
        );
    };
}

export default Home.export;