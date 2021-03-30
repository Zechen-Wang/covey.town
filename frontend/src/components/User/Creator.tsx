import React from 'react';
import {
    ListItem,
    Stack,
    Text,
    UnorderedList,
    Button,
  } from "@chakra-ui/react"
import useCoveyAppState from '../../hooks/useCoveyAppState';
import useVideoContext from "../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext";

export default function Creator(): JSX.Element {
    const { players } = useCoveyAppState();
    const { room } = useVideoContext();
    return(
        <Stack>
            <Text>
                User List: 
            </Text>
             <UnorderedList>
                {players.map((player)=>(
                <ListItem key={player.id}>
                    <>
                    {player.userName}
                    
                    <Button 
                    colorScheme="red" size="sm">kick out</Button>
                    </>
                 </ListItem>
                ))}
            </UnorderedList>
        </Stack>
    )
}

// onClick={async () => {await room.disconnect();}}