import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Link } from 'react-router-dom';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';

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

const EditButton = styled(Button)`
  background-color: #ffa500;
  margin-left: 20px;

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

const LinkStyle = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.color};
  &:hover {
    color: green;
  }
`;

const QuestionBody = styled.p`
  font-weight: normal;
  font-size: 0.9em;
  text-align: center;
  width: 80%;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
`;

const AnswerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  position: relative;
  width: 100%;
`;

const Checkmark = styled.span`
  position: absolute;
  top: 35%;
  left: -18px;
  transform: translateY(-50%);
  color: green;
  font-size: 1.2em;
`;

const AnswerBody = styled.p`
  flex-grow: 1;
  margin-top: 5px;
  font-size: 0.9em;
  font-weight: normal;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NewQuestionTitle = styled.h2`
  color: #555;
  margin: 0;
  font-weight: bold;
`;

const StyledCount = styled.div`
  display: flex;
  align-items: center;
  font-size: 1em;
  color: ${props => props.theme.color};
  margin-left: 20px;
  margin-top: 10px;

  svg {
    margin-right: 5px;
  }
`;

const LikeButton = styled(Button)`
  background-color: ${props => props.liked ? '#ffa500' : '#f5f5f5'};
  color: ${props => props.liked ? '#fff' : '#000'};
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    background-color: #ffa500;
    color: #fff;
  }
`;

const DislikeButton = styled(Button)`
  background-color: ${props => props.disliked ? '#dc143c' : '#f5f5f5'};
  color: ${props => props.disliked ? '#fff' : '#000'};
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    background-color: #dc143c;
    color: #fff;
  }
`;

function Answers() {
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ body: '' });
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [likedAnswers, setLikedAnswers] = useState([]);
  const [dislikedAnswers, setDislikedAnswers] = useState([]);

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
    fetchAnswers();
    fetchQuestion();
  }, []);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  async function fetchQuestion() {
    const questionId = localStorage.getItem('questionId');
    const response = await axios.get(`http://localhost:3001/questions/${questionId}`);
    setQuestion(response.data);
  }

  const filteredAnswers = answers.filter(answer => {
    return answer.body.toLowerCase().includes(searchTerm.toLowerCase());
  });

  async function fetchAnswers() {
    const questionId = localStorage.getItem('questionId');
    const response = await axios.get(`http://localhost:3001/answers/${questionId}`);
    setAnswers(response.data);

    const userId = localStorage.getItem('userId');
    const userResponse = await axios.get(`http://localhost:3001/answers/question/${questionId}/user/${userId}`);
    setUserAnswers(userResponse.data.answers);
  }

  async function handleAddAnswer() {
    const questionId = localStorage.getItem('questionId');
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`http://localhost:3001/questions/${questionId}/answers`, { ...newAnswer, userId });
      setNewAnswer({ body: '' });
      fetchAnswers();
      NotificationManager.success('Answer added successfully!', 'Success', 3000);
    } catch (error) {
      NotificationManager.error('An error occurred!', 'Error', 3000);
    }
  }

  async function handleDeleteAnswer(_answerId) {
    await axios.delete(`http://localhost:3001/answers/${_answerId}`);
    fetchAnswers();
    NotificationManager.success('Answer deleted successfully!', 'Success', 3000);
  }

  function handleEditAnswer(answer) {
    setEditingAnswer(answer);
  }

  async function handleUpdateAnswer() {
    try {
      await axios.put(`http://localhost:3001/answers/${editingAnswer._id}`, editingAnswer);
      setEditingAnswer(null);
      fetchAnswers();
      NotificationManager.success('Answer updated successfully!', 'Success', 3000);
    } catch (error) {
      NotificationManager.error('Answer updated failed!', 'Error', 3000);
    }
  }

  async function handleLike(id) {
    try {
      const userId = localStorage.getItem('userId');

      await axios.post(`http://localhost:3001/answers/${id}/like`, { userId });
      fetchAnswers();

      if (likedAnswers.includes(id)) {
        setLikedAnswers(likedAnswers.filter(_answerId => _answerId !== id));
      } else {
        setLikedAnswers([...likedAnswers, id]);
      }

    } catch (error) {
      console.error(error);
      NotificationManager.error('An error occurred!', 'Error', 3000);
    }
  }

  async function handleDislike(id) {
    try {
      const userId = localStorage.getItem('userId');

      await axios.post(`http://localhost:3001/answers/${id}/dislike`, { userId });
      fetchAnswers();

      if (dislikedAnswers.includes(id)) {
        setDislikedAnswers(dislikedAnswers.filter(_answerId => _answerId !== id));
      } else {
        setDislikedAnswers([...dislikedAnswers, id]);
      }

    } catch (error) {
      console.error(error);
      NotificationManager.error('An error occurred!', 'Error', 3000);
    }
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
          <Title>{question.title}</Title>
          <QuestionBody><i>{question.body}</i></QuestionBody>
          <Spacer />
          <Spacer />
          <Input type="text" placeholder="Search answers" value={searchTerm} onChange={handleSearch} />
          <NotificationContainer />
          {filteredAnswers.map(answer => (
            <AnswerContainer key={answer.id}>
              {answer.likes >= 5 && <Checkmark>&#10004;</Checkmark>}
              <AnswerBody>{answer.body}{' '}</AnswerBody>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <LikeButton
                    onClick={() => handleLike(answer._id)}
                    liked={likedAnswers.includes(answer._id)}
                  >
                    <AiFillLike />
                    Like
                  </LikeButton>
                  <DislikeButton
                    onClick={() => handleDislike(answer._id)}
                    disliked={dislikedAnswers.includes(answer._id)}
                  >
                    <AiFillDislike />
                    Dislike
                  </DislikeButton>
                </div>
                <div>
                  <StyledCount>
                    <AiFillLike style={{ color: '#008CBA', marginRight: '10px' }} />
                    {answer.likes}
                    <AiFillDislike style={{ color: '#dc143c', marginRight: '10px', marginLeft: '15px' }} />
                    {answer.dislikes}
                  </StyledCount>
                </div>
              </div>
              {userAnswers.some(userAnswer => userAnswer._id === answer._id) && (
                <ButtonContainer>
                  <EditButton onClick={() => handleEditAnswer(answer)}>Edit</EditButton>
                  <DeleteButton onClick={() => { handleDeleteAnswer(answer._id); }}>Delete</DeleteButton>
                </ButtonContainer>
              )}
            </AnswerContainer>
          ))}
          {editingAnswer && (
            <div>
              <Spacer />
              <Spacer />
              <Input type="text" placeholder="Body" value={editingAnswer.body} onChange={(event) => setEditingAnswer({ ...editingAnswer, body: event.target.value })} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleUpdateAnswer}>Save</Button>
              </div>
            </div>
          )}
          <div>
            <Spacer />
            <Spacer />
            <NewQuestionTitle>Answer Question</NewQuestionTitle>
            <Spacer />
            <Input type="text" placeholder="Body" value={newAnswer.body} onChange={(event) => setNewAnswer({ ...newAnswer, body: event.target.value })} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button id="my-button" onClick={handleAddAnswer}>Add Answer</Button>
            </div>
          </div>
          <Spacer />
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Answers;