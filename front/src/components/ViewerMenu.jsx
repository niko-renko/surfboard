import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Base from '../Base';

class Menu extends Base
{
    msToMin = ms => {
        const s = ms / 1000;

        const q = Math.floor(s / 60);
        const r = Math.floor(s % 60);

        return `${q < 10 ? '0' : ''}${q}:${r}${r < 10 ? '0' : ''}`;
    };

    start = () => {
        if(this.interval)
            return;

        this.interval = setInterval(
            () => {
                const presented = this.props.presented.find(
                    presented => presented.id === this.props.topic
                );

                presented.time += 1000;

                this.props._update(
                    {
                        presented: this.props.presented
                    }
                );

                return;
            },
            1000
        );

        return;
    };

    pause = () => {
        clearInterval(this.interval);
        this.interval = undefined;
        return;
    };

    toggleChat = () => this.props._update(
        {
            chat: !this.props.chat
        }
    );

    changePage = page => {
        const topic = this.props.agenda.find(
            (
                topic,
                index,
                topics
            ) => page >= topic.page && page < (topics[index + 1]?.page || Infinity)
        );

        this.props._update(
            {
                page,
                topic: topic.id,
                file: topic.file
            }
        );

        return;
    };

    previousPage = () => {
        if(this.props.page === 1)
            return;

        this.changePage(this.props.page - 1);

        return;
    };

    nextPage = () => {
        if(this.props.page === this.props.pages)
            return;

        this.changePage(this.props.page + 1);

        return;
    };

    previousTopic = () => {
        if(this.props.topic === 1)
            return;

        const previousTopic = this.props.agenda.find(
            topic => topic.id === this.props.topic - 1
        );

        this.changePage(previousTopic.page);

        return;
    };

    nextTopic = () => {
        if(this.props.topic === this.props.agenda.length)
            return;

        const nextTopic = this.props.agenda.find(
            topic => topic.id === this.props.topic + 1
        );

        this.changePage(nextTopic.page);

        return;
    };

    state = {
    };

    render = () => {
        const topic = this.props.agenda.find(
            topic => topic.id === this.props.topic
        );

        const presented = this.props.presented.find(
            topic => topic.id === this.props.topic
        );

        const time = this.msToMin(topic.time - presented.time);
        const button = this.props.chat ? 'Agenda' : 'Chat';

        return (
            <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
            >
                <Typography
                    className={this.props.classes.text}
                    variant='h6'
                >
                    {topic.title} {time} {this.props.page}/{this.props.pages}
                </Typography>
                <Button
                    variant='contained'
                    onClick={this.toggleChat}
                >
                    <Typography>
                        {button}
                    </Typography>
                </Button>
            </Stack>
        );
    };
}

export default Menu.export;