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
import usePlayerName from '../../hooks/usePlayerName';
import useVideoContext from "../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext";

export default function Creator(): JSX.Element {
    const { players, apiClient, currentTownID } = useCoveyAppState();
    const [currentTownBlockers, setcurrentTownBlockers] = useState<string[]>([]);
    const toast = useToast();
    const { room } = useVideoContext();
    const {name} = usePlayerName();

    const updateTownBlockersListings = useCallback(async () => {
        // console.log(apiClient);
        apiClient.listBlockerByTownId({coveyTownID: currentTownID}).then((blockers)=>setcurrentTownBlockers(blockers.blockers))
        if(currentTownBlockers.find((bname)=>bname===name)){
            room.disconnect();
        }
      }, [apiClient, currentTownBlockers, currentTownID, name, room]);
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
                    <Button onClick = {async () =>{await apiClient.deleteBlockerByTownId({
                        blockerName:blocker,
                        coveyTownID:currentTownID});
                        toast({
                            title: `unBlock User!`,
                            description: `${blocker} is unblocked`,
                            status: 'success',
                            isClosable: true,
                            duration: 2000,
                          })
                    }}
                    colorScheme="green" size="sm">
                        Unblock
                    </Button>
                    </>
                 </ListItem>
                ))}
            </UnorderedList>
        </Stack>
    )
}