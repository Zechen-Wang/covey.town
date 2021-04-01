import * as React from "react"
import {
  Text,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
} from "@chakra-ui/react"
import UsersServiceClient from '../../classes/UsersServiceClient'
import usePlayerName from '../../hooks/usePlayerName';

export default function SignIn(): JSX.Element {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setName } = usePlayerName();

  const handleLogIn = () => {
    setName(userName);
  }

  return (
    <VStack>
      <Text fontSize='70px' color='tomato' as='em'>Welcome to Covey.Town!</Text>
      <Box p="4" borderRadius='lg' width='lg'>
      <FormControl mb='4rem'>
        <FormLabel fontSize='30px'>Username</FormLabel>
        <Input variant="flushed" value={userName} onChange={(e) => {setUserName(e.target.value)}}/>
        <FormLabel mt='50px' fontSize='30px'>Password</FormLabel>
        <InputGroup>
          <Input type={show ? "text" : "password"} variant="flushed" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
          <InputRightElement width="4rem" pb='10px'>
          <Button onClick={handleClick} size='sm'>{show ? "Hide" : "Show"}</Button></InputRightElement>
        </InputGroup>
        <Stack direction="column" mt='3rem' align='center'>
          <Button colorScheme='teal' size='lg' width='xs' onClick={handleLogIn}>Log in</Button>
        </Stack>
      </FormControl>
      </Box> 
    </VStack>
  )
}