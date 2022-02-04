import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Base from '../Base';

class Present extends Base
{
    static styles = {
        link: {
            textDecoration: 'none',
            color: 'white'
        }
    };

    saveFiles = event => {
        const files = Array.from(event.target.files);

        this.update(
            {
                files: [
                    ...this.state.files,
                    ...files
                ]
            }
        );

        return;
    };

    addInput = () => {
        this.update(
            {
                inputs: [
                    ...this.state.inputs,
                    {
                        title: '',
                        description: '',
                        time: 0,
                        file: '',
                        page: 1
                    }
                ]
            }
        );

        return;
    };

    input = (
        position,
        field,
        value
    ) => {
        const copy = [...this.state.inputs];

        copy[position][field] = value;

        this.update(
            {
                inputs: copy
            }
        );

        return;
    };

    removeInput = position => {
        this.update(
            {
                inputs: this.state.inputs.filter(
                    (
                        input,
                        index
                    ) => !(position === index)
                )
            }
        );

        return;
    };

    create = async () => {
        if(!this.state.inputs.length)
            return;

        const b64FilesPromises = this.state.files.map(
            file => {
                const reader = new FileReader();

                // TODO: Error handling
                const b64Promise = new Promise(
                    resolve => reader.addEventListener(
                        'load',
                        event => resolve(
                            {
                                name: file.name,
                                data: event.target.result
                            }
                        )
                    )
                );

                reader.readAsDataURL(file);

                return b64Promise;
            }
        );

        const b64files = await Promise.all(b64FilesPromises);

        const inputs = this.state.inputs.map(
            (
                input,
                index
            ) => (
                {
                    ...input,
                    id: index + 1,
                    file: input.file ? input.file : b64files[0].name,
                    time: Number(input.time) * 60 * 1000,
                    page: Number(input.page)
                }
            )
        );

        await this.props.api(
            {
                action: 'create',
                userID: this.props.user.id,
                name: this.state.name,
                agenda: inputs,
                files: b64files
            }
        );

        const copy = {
            ...this.props.user
        };

        copy.presentations.push(
            {
                name: this.state.name,
                agenda: inputs,
                files: b64files
            }
        );

        this.props.dispatch(
            {
                type: 'updateUser',
                user: copy
            }
        );

        this.update(
            {
                name: '',
                files: [],
                inputs: []
            }
        );

        return;
    };

    present = name => {
        const presentation = this.props.user.presentations.find(
            presentation => presentation.name === name
        );

        console.log({
            type: 'updatePresenting',
            ...presentation,
            presenting: true,
            presenter: true,
            topic: 1,
            page: presentation.agenda[0].page,
            file: presentation.agenda[0].file,
            presented: presentation.agenda.map(
                topic => (
                    {
                        id: topic.id,
                        time: 0
                    }
                )
            ),
            chat: false
        })

        this.props.dispatch(
            {
                type: 'updatePresenting',
                ...presentation,
                presenting: true,
                presenter: true,
                topic: 1,
                page: presentation.agenda[0].page,
                file: presentation.agenda[0].file,
                presented: presentation.agenda.map(
                    topic => (
                        {
                            id: topic.id,
                            time: 0
                        }
                    )
                ),
                chat: false
            }
        );

        return;
    };

    delete = async name => {
        await this.props.api(
            {
                action: 'delete',
                userID: this.props.user.id,
                name
            }
        );

        const copy = {
            ...this.props.user
        };

        copy.presentations = copy.presentations.filter(
            presentation => presentation.name !== name
        );

        this.props.dispatch(
            {
                type: 'updateUser',
                user: copy
            }
        );

        return;
    };

    state = {
        name: '',
        files: [],
        inputs: []
    };

    render = () => {
        const presentations = this.props.user.presentations.map(
            (
                presentation,
                index
            ) => (
                <Box key={index} >
                    {presentation.name}
                    <Button
                        onClick={() => this.present(presentation.name)}
                        variant='contained'
                    >
                        <Link
                            className={this.props.classes.link}
                            to='/presentation'
                        >
                            Present
                        </Link>
                    </Button>
                    <Button
                        onClick={() => this.delete(presentation.name)}
                        variant='contained'
                    >
                        Delete
                    </Button>
                </Box>
            )
        );

        const fileOptions = this.state.files.map(
            file => (
                <option
                    key={file.name}
                    value={file.name}
                >
                    {file.name}
                </option>
            )
        );

        const inputs = this.state.inputs.map(
            (
                input,
                index
            ) => {
                return (
                    <Box
                        key={index}
                    >
                        {index + 1}
                        <TextField
                            variant='standard'
                            label='Title'
                            value={input.title}
                            onChange={event => this.input(index, 'title', event.target.value)}
                        />
                        <TextField
                            variant='standard'
                            label='Description'
                            value={input.description}
                            onChange={event => this.input(index, 'description', event.target.value)}
                        />
                        <TextField
                            variant='standard'
                            label='Minutes'
                            value={input.time}
                            type='number'
                            onChange={event => this.input(index, 'time', event.target.value)}
                        />
                        <select
                            onChange={event => this.input(index, 'file', event.target.value)}
                        >
                            {fileOptions}
                        </select>
                        <TextField
                            variant='standard'
                            label='Page'
                            value={input.page}
                            type='number'
                            onChange={event => this.input(index, 'page', event.target.value)}
                        />
                        <Button
                            variant='contained'
                            onClick={() => this.removeInput(index)}
                        >
                            Delete
                        </Button>
                    </Box>
                );
            }
        );

        const files = this.state.files.map(
            file => file.name
        );

        return (
            <Stack>
                {presentations}
                <TextField
                    variant='standard'
                    label='Name'
                    value={this.state.name}
                    onChange={event => this.update({name: event.target.value})}
                />
                <Button
                    variant='contained'
                    component='label'
                >
                    Upload PDFs
                    <input
                        onChange={this.saveFiles}
                        type='file'
                        accept='application/pdf'
                        hidden
                        multiple
                    />
                </Button>
                {files}

                <Button
                    onClick={this.addInput}
                    variant='contained'
                >
                    Add topic
                </Button>
                {inputs}
                <Button
                    variant='contained'
                    onClick={this.create}
                >
                    Create
                </Button>
            </Stack>
        );
    };
}

export default Present.export;