import React, { useState, useMemo } from 'react';
import { useParams  , useHistory } from 'react-router-dom'

import { Box, Typography, Button, CircularProgress } from '@material-ui/core'
import { useSnackbar } from '../../contexts/SnackbarContext';
import { makeStyles } from '@material-ui/core/styles';
import Question from './Question';
import produce from "immer";
import { createDbReflectionResponses } from "../../models/reflectionResponseModel";

import QUESTIONS from "../../reflections/questions.json";
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  formGroup: {
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  textField: {
    // backgroundColor: '#e5e5e5',
  },
}))

const ReflectionForm = ({ reflection }) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const { setSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory()
  const { name  } = useParams()

  const questions = useMemo(
    () => reflection
      .questions
      .map(questionId => QUESTIONS.find(question => question.id === questionId)),
    [reflection],
  );

  const [answers, setAnswers] = useState(questions.map(() => ""));

  const handleSubmitClick = async () => {
    const answerDocs = answers.map((answer, index) => {
      const question = questions[index];
      return {
        reflectionId: reflection.id,
        questionId: question.id,
        userId: currentUser.id,
        answer,
        submittedAt: new Date(),
        timestamp: Date.now(),
      }
    });
    try {
      setIsLoading(true);
      await createDbReflectionResponses(answerDocs);
    } catch (err) {
      setSnackbar({
        message: "Failed to submit!",
        open: true,
        type: "error",
      })
    } finally {
      setIsLoading(false);
      history.push("/chapterend/" + name + '/' + reflection.chapter)
    }
  }

  return (
    <>
      <Box pt={6} pb={2} className={classes.container}>
        <Box>
          <Typography className={classes.subtitle} variant="subtitle1" align="center">
            SHARE YOUR THOUGHTS WITH US
          </Typography>
        </Box>
        <Box>
          <Typography className={classes.title} variant="h1" align="center">
            REFLECTIONS FORM
          </Typography>
        </Box>
      </Box>
      {questions.map((question, index) => (
        <Box key={question.id} mt={2}  className={classes.container}>
          <Question
            key={question.id}
            question={question}
            value={answers[index]}
            onChange={answer => setAnswers(
              produce(draftAnswers => {
                draftAnswers[index] = answer;
              }, answers),
            )}
          />
        </Box>
      ))}
      <Box mt={2} p={2}>
        {
          isLoading
            ? <CircularProgress />
            : <Button variant="contained" color="primary" fullWidth onClick={handleSubmitClick}>Submit</Button>
        }
      </Box>
    </>
  );
};

export default ReflectionForm;
