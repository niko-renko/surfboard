import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

const wss = new WebSocketServer(
    {
        port: 8081
    }
);

// Replace with a DB
const users = [];

wss.on(
    'connection',
    ws => {
        ws.on(
            'message',
            message => {
                try
                {
                    message = JSON.parse(message);
                }
                catch(error)
                {
                    return;
                }

                if(message.action === 'ping')
                {
                    return ws.send(
                        JSON.stringify(
                            {
                                id: message.id,
                                success: true
                            }
                        )
                    );
                }

                if(message.action === 'auth')
                {
                    let user = users.find(
                        user => user.id === message.userID
                    );


                    if(!user)
                    {
                        user = {
                            id: uuid(),
                            presentations: []
                        };

                        users.push(user);
                    }

                    return ws.send(
                        JSON.stringify(
                            {
                                id: message.id,
                                user,
                                success: true
                            }
                        )
                    );
                }

                if(message.action === 'create')
                {
                    const user = users.find(
                        user => user.id === message.userID
                    );

                    user.presentations.push(
                        {
                            name: message.name,
                            agenda: message.agenda,
                            files: message.files
                        }
                    );

                    return ws.send(
                        JSON.stringify(
                            {
                                id: message.id,
                                success: true
                            }
                        )
                    );
                }

                if(message.action === 'delete')
                {
                    const user = users.find(
                        user => user.id === message.userID
                    );

                    user.presentations = user.presentations.filter(
                        presentation => presentation.name !== message.name
                    );

                    return ws.send(
                        JSON.stringify(
                            {
                                id: message.id,
                                success: true
                            }
                        )
                    );
                }

                return;
            }
        );

        return;
    }
);