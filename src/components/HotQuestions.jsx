import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { NotificationContainer } from 'react-notifications';
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
  border-radius: 15px;
  padding: 20px;
  padding-right: 20px;
  width: 1100px;
  height: 700px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
  overflow: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
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

  &:hover {
    background-color: #45a049;
  }
`;

const ButtonView = styled.button`
  background-color: #b7c0c7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 20px;
`;

const LinkStyle = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.color};
  &:hover {
    color: green;
  }
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

function HotQuestions() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const searchQuestions = questions.filter(question => {
    return question.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredQuestions = searchQuestions.filter(question => {
    return question.views > 5;
  });

  async function fetchQuestions() {
    const response = await axios.get('http://localhost:3001/questions');
    setQuestions(response.data);
  }

  const handleViewQuestion = async (id, title) => {
    localStorage.setItem('questionId', id);
    localStorage.setItem('questionTitle', title);
    try {
      await axios.get(`http://localhost:3001/questions/${id}/views`);
      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

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
        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          <LinkStyle to="/questions" style={{ color: 'white', textDecoration: 'none' }}>Home</LinkStyle>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'end', paddingRight: '20px' }}>
          <LinkStyle to="/profile" style={{ color: 'white', textDecoration: 'none' }}>My profile</LinkStyle>
        </div>
      </nav>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Wrapper>
        <Container>
          <NavBar />
          <Spacer />
          <Spacer />
          <Input type="text" placeholder="Search questions" value={searchTerm} onChange={handleSearch} />
          <NotificationContainer />
          {filteredQuestions.map(question => (
            <>
              <QuestionContainer key={question.id}>
                <QuestionTitle>{question.title}</QuestionTitle>
                <QuestionBody>{question.body}</QuestionBody>
                <LinkStyle to="/answers">
                  <Button onClick={() => handleViewQuestion(question._id, question.title)}>View Question</Button>
                </LinkStyle>
                <ButtonView>{'   '} Views: {question.views}</ButtonView>
              </QuestionContainer>
            </>
          ))}
          <Spacer />
          <Spacer />
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default HotQuestions;