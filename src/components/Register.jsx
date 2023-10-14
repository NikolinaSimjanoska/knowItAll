import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Link } from 'react-router-dom';

const lightTheme = {
  backgroundColor: '#f9f9f9',
  color: '#000',
};

const darkTheme = {
  backgroundColor: '#222',
  color: '#fff',
};

const Spacer = styled.div`
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginLink = styled.button`
  color: ${props => props.theme.color};
  background-color: transparent;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: green;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 400px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LinkStyle = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.color};
  &:hover {
    color: green;
  }
`;

function Register() {
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '', isAdmin: false });
  const [isRegistered, setRegistered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  useEffect(() => {
    const devicePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(devicePreference);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Control') {
        setIsCtrlPressed(true);
      }

      if (isCtrlPressed && event.key === 'd') {
        DarkMode();
      }
      else if (isCtrlPressed && event.key === 'l') {
        LightMode();
      }
    }

    function handleKeyUp(event) {
      if (event.key === 'Control') {
        setIsCtrlPressed(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCtrlPressed]);

  const DarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const LightMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  async function handleAddUser() {
    try {
      if (!newUser.email.includes('@')) {
        NotificationManager.error('Invalid email address!', 'Error', 3000);
        return;
      }
      const response = await axios.post('http://localhost:3001/register', newUser);
      setNewUser({ username: '', password: '', email: '', isAdmin: false });
      NotificationManager.success('Registration successfully!', 'Success', 3000);
      setTimeout(() => NotificationManager.removeAll(), 2000);
      setRegistered(true);
      localStorage.setItem('username', newUser.username);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('email', newUser.email);
    } catch (error) {
      NotificationManager.error('An error occurred!', 'Error', 3000);
      setTimeout(() => NotificationManager.removeAll(), 2000);
    }
  }

  const showNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('KnowItAll', {
            body: 'Registration successfull!'
          });
        }
      });
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Wrapper>
        <Container>
          <Title>Register</Title>
          <NotificationContainer />
          <Form>
            {!isRegistered ? (
              <>
                <Input type="text" placeholder="Username" value={newUser.username} onChange={(event) => setNewUser({ ...newUser, username: event.target.value })} />
                <Input type="password" placeholder="Password" value={newUser.password} onChange={(event) => setNewUser({ ...newUser, password: event.target.value })} />
                <Input type="email" placeholder="Email" value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} />
                <Button onClick={handleAddUser}>Register</Button>
              </>
            ) : (
              <LinkStyle to='/login'>
                <Button onClick={showNotification()} >Proceed to Log in</Button>
              </LinkStyle>
            )}
          </Form>
          {!isRegistered &&
            <Spacer>
              <Link to='/login'>
                <LoginLink>Alredy have a profile? Log in.</LoginLink>
              </Link>
            </Spacer>
          }
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Register;