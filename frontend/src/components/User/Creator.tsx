import React, {useState} from 'react';
import {
    ListItem,
    Stack,
    Text,
    UnorderedList,
    Button,
  } from "@chakra-ui/react"
import useCoveyAppState from '../../hooks/useCoveyAppState';
// import useVideoContext from "../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext";

export default function Creator(): JSX.Element {
    const { players, apiClient, currentTownID } = useCoveyAppState();
    const [isBlocked, setIsBlocked] = useState<boolean>(false);

    // const { room } = useVideoContext();
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
                    {!isBlocked &&
                    <Button onClick={
                        async () => {
                        await apiClient.addBlocker({
                        coveyTownID: currentTownID,
                        blockerName: player.userName,
                        });setIsBlocked(true)}
                    }
                    colorScheme="red" size="sm">Block</Button>
                    }
                    {isBlocked &&
                    <Button onClick = {()=>setIsBlocked(false)}
                    colorScheme="green" size="sm">Unblock</Button>
                    }
                    </>
                 </ListItem>
                ))}
            </UnorderedList>
        </Stack>
    )
}

// onClick={async () => {await room.disconnect();}}