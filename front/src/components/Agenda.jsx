import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import Base from '../Base';

class Agenda extends Base
{
    static styles = {
        topic: {
            display: 'grid',
            gridTemplateColumns: '6fr 2fr',
            gridTemplateRows: '50px 70px',
            gridTemplateAreas: `
                "title time"
                "description time"
            `
        },
        text: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        },
        title: {
            gridArea: 'title'
        },
        time: {
            gridArea: 'time',
            background: '#1f1f1f'
        },
        description: {
            gridArea: 'description'
        },
        divider: {
            background: '#2196f3'
        },
        current: {
            background: '#2196f3'
        }
    };

    msToMin = ms => {
        const s = ms / 1000;

        const q = Math.floor(s / 60);
        const r = Math.floor(s % 60);

        return `${q < 10 ? '0' : ''}${q}:${r}${r < 10 ? '0' : ''}`;
    };

    state = {
    };

    render = () => {
        const divider = <Divider
            className={this.props.classes.divider}
        />;

        const topics = this.props.agenda.map(
            topic => {
                const presented = this.props.presented.find(
                    presented => presented.id === topic.id
                );

                const topicClass = `${this.props.classes.topic} ${this.props.topic === topic.id && this.props.classes.current}`;

                const titleClass = `${this.props.classes.title} ${this.props.classes.text}`;
                const timeClass = `${this.props.classes.time} ${this.props.classes.text}`;
                const descriptionClass = `${this.props.classes.description} ${this.props.classes.text}`;

                const time = this.msToMin(topic.time - presented.time);

                return (
                    <Box
                        key={topic.id}
                        className={topicClass}
                    >
                        <Box className={titleClass} >
                            <Typography>
                                {topic.title}
                            </Typography>
                        </Box>
                        <Box
                            className={timeClass}
                        >
                            <Typography>
                                {time}
                            </Typography>
                        </Box>
                        <Box
                            className={descriptionClass}
                        >
                            <Typography>
                                {topic.description}
                            </Typography>
                        </Box>
                    </Box>
                );
            }
        );

        return (
            <Stack
                divider={divider}
            >
                {topics}
            </Stack>
        );
    };
}

export default Agenda.export;