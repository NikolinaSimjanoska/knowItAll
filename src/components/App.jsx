import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Root from './Root.jsx';
import Profile from './Profile.jsx';
import Questions from './Questions.jsx';
import Answers from './Answers.jsx';
import HotQuestions from './HotQuestions.jsx';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename='/main_window' >
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/answers" element={<Answers />} />
            <Route path="/hotQuestions" element={<HotQuestions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
