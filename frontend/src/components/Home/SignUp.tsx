import * as React from "react"
import {
  Text,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  Heading,
  Select,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react"
import usePlayerName from '../../hooks/usePlayerName';

export default function SignUp(): JSX.Element {

  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordToMatch, setPasswordToMatch] = React.useState('');
  const [invalid, setInvalid] = React.useState(false);
  const toast = useToast();
  const { setName } = usePlayerName();

  React.useEffect(() => {
    if (passwordToMatch && password !== passwordToMatch) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [passwordToMatch, password])

  const handleSignIn = () => {
    if (!(userName && password && passwordToMatch)) {
      toast({
        title: "Sign in failed",
        description: "Please complete all required fields",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    if (invalid === true) {
      toast({
        title: "Sign in failed",
        description: "Password does not match",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
    setName(userName);
  }

  return (
    <VStack>
      <Heading fontSize='70px' color='greenyellow' fontStyle='italic'>Create an Account</Heading>
      <Text fontSize='50px' color='tomato' as='em'>And Enjoy Covey.Town!</Text>
      <Box p="4" borderRadius='lg' width='lg'>
      <FormControl mb='1rem' isRequired>
        <FormLabel fontSize='20px'>Username</FormLabel>
        <Input value={userName} onChange={(e) => setUserName(e.target.value)}/>
      </FormControl>
      <FormControl mb='1rem' isRequired>
        <FormLabel fontSize='20px'>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </FormControl>
      <FormControl mb='1rem' isRequired>
        <FormLabel fontSize='20px'>Re-enter Password</FormLabel>
        <Input type="password" value={passwordToMatch} onChange={(e) => setPasswordToMatch(e.target.value)} isInvalid={invalid}/>
      </FormControl>
      <FormControl mb='1rem'>
        <FormLabel fontSize='20px'>Email</FormLabel>
        <Input type="email"/>
      </FormControl>
      <FormControl mb='1rem'>
        <FormLabel fontSize='20px'>Gender</FormLabel>
        <Select placeholder="Select gender">
          <option>Male</option>
          <option>Female</option>
          <option>Prefer not to say</option>
        </Select>
      </FormControl>
      <FormControl mb='1rem'>
        <FormLabel fontSize='20px'>Age</FormLabel>
        <NumberInput><NumberInputField /></NumberInput>
      </FormControl>
      <FormControl mb='1rem'>
        <FormLabel fontSize='20px'>City</FormLabel>
        <Input />
      </FormControl>
        <Stack direction="column" spacing={7} align='center' pt='2rem'>
          <Button colorScheme='green' size='lg' width='xs' onClick={handleSignIn}>Sign up</Button>
        </Stack>
      </Box>
    </VStack>
  )
}