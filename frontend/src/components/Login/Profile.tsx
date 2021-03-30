import * as React from "react"
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react"
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import usePlayerName from '../../hooks/usePlayerName';

export default function Profile(): JSX.Element {

  const [username, setUsername] = React.useState(usePlayerName().name);
  const [password, setPassword] = React.useState('');
  const [passwordToMatch, setPasswordToMatch] = React.useState('');
  const [invalid, setInvalid] = React.useState(false);
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  React.useEffect(() => {
    if (passwordToMatch && password !== passwordToMatch) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [passwordToMatch, password])

  const handleChange = () => {
    if (!(username && password && passwordToMatch)) {
      toast({
        title: "Edit failed",
        description: "Please complete all required fields",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }
    if (invalid === true) {
      toast({
        title: "Edit failed",
        description: "Password does not match",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  }

  return (
    <>
    <MenuItem onClick={onOpen}>
      <Typography variant="body1">Profile</Typography>
    </MenuItem>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Edit your profile</ModalHeader>
        <ModalCloseButton/>
        <form onSubmit={(ev)=>{ev.preventDefault(); handleChange()}}>
          <ModalBody pb={6}>
          <FormControl mb='1rem' isRequired>
        <FormLabel fontSize='20px'>Username</FormLabel>
        <Input value={username} onChange={(e) => setUsername(e.target.value)}/>
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
          </ModalBody>
          <ModalFooter>
            <Button data-testid='updatebutton' colorScheme="blue" mr={3} value="update" name='action2' onClick={handleChange}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
    </>
    
  )
}