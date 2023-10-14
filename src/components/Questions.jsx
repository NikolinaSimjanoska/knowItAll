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
  margin-left: 10px;

  &:hover {
    background-color: #45a049;
  }
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
  margin-left: 10px;
`;

const QuestionBody = styled.p`
  margin-top: 5px;
  font-size: 0.9em;
  font-weight: normal;
  margin-left: 10px;
`;

const NewQuestionTitle = styled.h2`
  color: #555;
  margin: 0;
  font-weight: bold;
`;

const ButtonAdd = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #008CBA;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #006D9F;
  }
`;


const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  margin-left: 10px;
`;

const Tag = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  background-color: #ccc;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"] + span {
    margin-left: 5px;
  }

  input[type="checkbox"] + span::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #555;
    border-radius: 3px;
    margin-right: 5px;
    background-color: transparent;
  }

  input[type="checkbox"]:checked + span::before {
    background-color: #4CAF50;
    border-color: #4CAF50;
  }
`;

const TagButton = styled.button`
  display: inline-block;
  padding: 5px 10px;
  background-color: ${props => props.selected ? '#4CAF50' : '#ccc'};
  color: ${props => props.selected ? 'white' : 'black'};
  border-radius: 5px;
  border-color: #ccc;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
`;

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ id: '', title: '', body: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
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

  const handleTagChange = (event) => {
    const { value } = event.target;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedTags([...selectedTags, value]);
    } else {
      setSelectedTags(selectedTags.filter(tag => tag !== value));
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const filteredQuestions = questions.filter(question => {
    return question.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      selectedTags.every(tag => question.tags.includes(tag));
  });

  async function fetchQuestions() {
    const response = await axios.get('http://localhost:3001/questions');
    setQuestions(response.data);
  }

  const handleAddQuestion = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post('http://localhost:3001/questions', { ...newQuestion, userId, tags: selectedTags });
      setNewQuestion({ id: '', title: '', body: '', tags: [] });
      setSelectedTags([]);
      fetchQuestions();
      NotificationManager.success('Question added successfully!', 'Success', 3000);
    } catch (error) {
      NotificationManager.error('Error!', 'Error', 3000);
    }
  };

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
          <LinkStyle to="/hotQuestions" style={{ color: 'white', textDecoration: 'none' }}>Hot Questions</LinkStyle>
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
            <QuestionContainer key={question.id}>
              <QuestionTitle>{question.title}</QuestionTitle>
              <QuestionBody>{question.body}</QuestionBody>
              <TagContainer>
                {question.tags.map(tag => (
                  <TagButton
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onClick={() => handleTagChange({ target: { value: tag, checked: !selectedTags.includes(tag) } })}
                  >
                    {tag}
                  </TagButton>
                ))}
              </TagContainer>
              <Spacer />
              <LinkStyle to="/answers">
                <Button onClick={() => handleViewQuestion(question._id, question.title)}>View Question</Button>
              </LinkStyle>
            </QuestionContainer>
          ))}
          <Spacer />
          <Spacer />
          <div>
            <NewQuestionTitle>Ask a new question</NewQuestionTitle>
            <Spacer />
            <Input type="text" placeholder="Question" value={newQuestion.title} onChange={(event) => setNewQuestion({ ...newQuestion, title: event.target.value })} />
            <Input type="text" placeholder="Body" value={newQuestion.body} onChange={(event) => setNewQuestion({ ...newQuestion, body: event.target.value })} />
            <Spacer />
            <TagContainer>
            <Tag>
              <input
                type="checkbox"
                value="tag1"
                checked={selectedTags.includes('tag1')}
                onChange={handleTagChange}
              />
              <span>Tag 1</span>
            </Tag>
            <Tag>
              <input
                type="checkbox"
                value="tag2"
                checked={selectedTags.includes('tag2')}
                onChange={handleTagChange}
              />
              <span>Tag 2</span>
            </Tag>
          </TagContainer>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonAdd onClick={handleAddQuestion}>Ask Question</ButtonAdd>
            </div>
          </div>
          <Spacer />
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Questions;