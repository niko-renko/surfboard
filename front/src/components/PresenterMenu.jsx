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
                const copy = [...this.props.presented];

                const presented = copy.find(
                    presented => presented.id === this.props.topic
                );

                presented.time += 1000;

                this.props.dispatch(
                    {
                        type: 'updatePresented',
                        presented: copy
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

    toggleChat = () => this.props.dispatch(
        {
            type: 'updateChat',
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

        this.props.dispatch(
            {
                type: 'updateLocation',
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

        this.props.dispatch(
            {
                type: 'changeFile',
                file: previousTopic.file
            }
        );

        console.log(previousTopic.file);

        this.changePage(previousTopic.page);

        return;
    };

    nextTopic = () => {
        if(this.props.topic === this.props.agenda.length)
            return;

        const nextTopic = this.props.agenda.find(
            topic => topic.id === this.props.topic + 1
        );

        this.props.dispatch(
            {
                type: 'changeFile',
                file: nextTopic.file
            }
        );

        this.changePage(nextTopic.page);

        return;
    };

    state = {
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
        return;
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
                <Button
                    variant='contained'
                    onClick={this.start}
                >
                    Start
                </Button>
                <Button
                    variant='contained'
                    onClick={this.pause}
                >
                    Pause
                </Button>
                <Typography
                    className={this.props.classes.text}
                    variant='h6'
                >
                    {time}
                </Typography>

                <Button
                    variant='contained'
                    onClick={this.previousPage}
                >
                    Previous Slide
                </Button>
                <Button
                    variant='contained'
                    onClick={this.nextPage}
                >
                    Next Slide
                </Button>
                <Typography
                    className={this.props.classes.text}
                    variant='h6'
                >
                    {this.props.page}/{this.props.pages}
                </Typography>

                <Button
                    variant='contained'
                    onClick={this.previousTopic}
                >
                    Previous Topic
                </Button>
                <Button
                    variant='contained'
                    onClick={this.nextTopic}
                >
                    Next Topic
                </Button>
                <Typography
                    className={this.props.classes.text}
                    variant='h6'
                >
                    {this.props.topic}/{this.props.agenda.length}
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