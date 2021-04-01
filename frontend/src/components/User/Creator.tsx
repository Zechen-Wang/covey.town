import React, {useCallback, useEffect, useState} from 'react';
import {
    ListItem,
    Stack,
    Text,
    UnorderedList,
    Button,
    useToast,
  } from "@chakra-ui/react"
import useCoveyAppState from '../../hooks/useCoveyAppState';
// import useVideoContext from "../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext";

export default function Creator(): JSX.Element {
    const { players, apiClient, currentTownID } = useCoveyAppState();
    // const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [currentTownBlockers, setcurrentTownBlockers] = useState<string[]>([]);
    const toast = useToast();

    const updateTownBlockersListings = useCallback(() => {
        // console.log(apiClient);
        apiClient.listBlockerByTownId({coveyTownID: currentTownID}).then((blockers)=>setcurrentTownBlockers(blockers.blockers))
      }, [apiClient, currentTownID]);
      useEffect(() => {
        updateTownBlockersListings();
        const timer = setInterval(updateTownBlockersListings, 1000);
        return () => {
          clearInterval(timer)
        };
      }, [updateTownBlockersListings]);

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
                    <Button onClick={
                        async () => {
                        await apiClient.addBlocker({
                        coveyTownID: currentTownID,
                        blockerName: player.userName,
                        });toast({
                            title: `Block User!`,
                            description: `${player.userName} is blocked`,
                            status: 'success',
                            isClosable: true,
                            duration: 2000,
                          })}}
                    colorScheme="red" size="sm">Block</Button>
                    </>
                 </ListItem>
                ))}
            </UnorderedList>
            <Text>
                Blocker List: 
            </Text>
            <UnorderedList>
                {currentTownBlockers.map((blocker)=>(
                <ListItem key={blocker}>
                    <>
                    {blocker}
                    <Button colorScheme="green" size="sm">
                        Unblock
                    </Button>
                    </>
                 </ListItem>
                ))}
            </UnorderedList>
        </Stack>
    )
}

// onClick={async () => {await room.disconnect();}}