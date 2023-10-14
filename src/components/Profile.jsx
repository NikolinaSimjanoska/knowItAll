import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Link } from 'react-router-dom';
import profileImage from '../images/profile.png';

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
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* align items in center */
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 600px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
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

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  align-self: center;
`;

const Username = styled.h2`
  margin: 0;
  margin-bottom: 10px;
  text-align: center;
`;

const Email = styled.h2`
  margin: 0;
  margin-bottom: 10px;
  text-align: center;
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
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const ButtonSave = styled.button`
  background-color: #008CBA;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    background-color: #006D9F;
  }
`;

const ButtonCancel = styled.button`
  background-color: #dc143c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    background-color: #b22222;
  }
`;

const ButtonQuestions = styled.button`
  background-color: #ffa500;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    background-color: #ff8c00;
  }
`;

const LinkStyle = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.color};
  &:hover {
    color: green;
  }
`;

const NavBarContainer = styled.div`
  width: 600px;
`;

const QuestionContainer = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
`;

const QuestionTitle = styled.h2`
  margin: 0;
  font-weight: bold;
`;

const QuestionBody = styled.p`
  margin-top: 5px;
  font-size: 0.9em;
  font-weight: normal;
`;

const EditButton = styled(Button)`
  background-color: #ffa500;

  &:hover {
    background-color: #ff8c00;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc143c;

  &:hover {
    background-color: #b22222;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

function Profile() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [storedQuestions, setStoredQuestions] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const response = await axios.get('http://localhost:3001/users');
    setUsers(response.data);
  }

  async function handleEditProfile() {
    try {

      if (!newEmail.includes('@')) {
        NotificationManager.error('Invalid email address!', 'Error', 3000);
        return;
      }

      await axios.put(`http://localhost:3001/users/${username}`, { username: newUsername, password: newPassword, email: newEmail });
      NotificationManager.success('Profile updated!', 'Success', 3000);
      setTimeout(() => NotificationManager.removeAll(), 2000);
      setUsername(newUsername);
      setEmail(newEmail);
      setIsEditing(false);
    } catch (error) {
      NotificationManager.error('Error updating profile!', 'Error', 3000);
      setTimeout(() => NotificationManager.removeAll(), 2000);
    }
  }

  const handleMyQuestions = async () => {
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.get(`http://localhost:3001/questions/user/${userId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error retrieving questions:', error);
    }
    setShowQuestions(!showQuestions); // Preklop med prikazom in skrivanjem vprašanj
  };

  async function handleUpdateQuestion() {
    try {
      await axios.put(`http://localhost:3001/questions/${editingQuestion._id}`, editingQuestion);
      setEditingQuestion(null);
      handleMyQuestions();  // refresh questions after update
      NotificationManager.success('Question updated successfully!', 'Success', 3000);
    }
    catch (error) {
      NotificationManager.error('Error!', 'Error', 3000);
    }
  }

  async function handleDeleteQuestion(_questionId) {
    try {
      await axios.delete(`http://localhost:3001/questions/${_questionId}`);
      NotificationManager.success('Question deleted successfully!', 'Success', 3000);
      handleMyQuestions();
    }
    catch (error) {
      NotificationManager.error('Cannot delete question!', 'Error', 3000);
    }
  }

  function handleEditQuestion(question) {
    setEditingQuestion(question);
  }

  function NavBar() {
    return (
      <nav style={{
        backgroundColor: '#4CAF50',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div style={{ flexGrow: 1, paddingLeft: '15px' }}>
          <h1 style={{ color: 'white', margin: 0 }}>KnowItAll</h1>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <div>
            <LinkStyle to="/questions" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Home</LinkStyle>
            <LinkStyle to="/hotQuestions" style={{ color: 'white', textDecoration: 'none' }}>Hot Questions</LinkStyle>
          </div>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'end', paddingRight: '20px' }}>
          <LinkStyle to="/login" style={{ color: 'white', textDecoration: 'none' }}>Log out</LinkStyle>
        </div>
      </nav>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Wrapper>
        <Container>
          <NavBarContainer>
            <NavBar />
          </NavBarContainer>
          <Spacer />
          <ProfileImage src={profileImage} alt="Profile" />
          <Username>{username}</Username>
          <Email>{email}</Email>
          {isEditing ? (
            <>
              <Input type="text" placeholder="New Username" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} />
              <Input type="password" placeholder="New Password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              <Input type="email" placeholder="New Email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} /> {/* Dodajanje polja za email */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ButtonQuestions onClick={handleEditProfile}>Save</ButtonQuestions>
                <ButtonCancel onClick={() => setIsEditing(false)}>Cancel</ButtonCancel>
              </div>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
          <Spacer />
          <Spacer />
          <ButtonSave onClick={handleMyQuestions} active={showQuestions}>
            {showQuestions ? 'Close My Questions' : 'My Questions'}
          </ButtonSave>
          <Spacer />
          {showQuestions && questions.map(question => (
            <NavBarContainer>
              <QuestionContainer key={question._id}>
                <QuestionTitle>{question.title}</QuestionTitle>
                <QuestionBody>{question.body}</QuestionBody>
                <ButtonContainer>
                  {editingQuestion && editingQuestion._id === question._id ? (
                    <>
                      <ButtonSave onClick={handleUpdateQuestion}>Save</ButtonSave>
                      <ButtonCancel onClick={() => setEditingQuestion(null)}>Cancel</ButtonCancel>
                    </>
                  ) : (
                    <>
                      <EditButton onClick={() => handleEditQuestion(question)}>Edit</EditButton>
                      <DeleteButton onClick={() => { handleDeleteQuestion(question._id); }}>Delete</DeleteButton>
                    </>
                  )}
                </ButtonContainer>
                {editingQuestion && editingQuestion._id === question._id && (
                  <div>
                    <Spacer />
                    <Spacer />
                    <Input type="text" placeholder="Question" value={editingQuestion.title} onChange={(event) => setEditingQuestion({ ...editingQuestion, title: event.target.value })} />
                    <Input type="text" placeholder="Body" value={editingQuestion.body} onChange={(event) => setEditingQuestion({ ...editingQuestion, body: event.target.value })} />
                  </div>
                )}
              </QuestionContainer>
            </NavBarContainer>
          ))}
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Profile;
