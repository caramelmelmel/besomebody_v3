import { useState, useEffect } from 'react';
import QuestionPanel from './QuestionPanel';
import { useAuth } from '../../../contexts/AuthContext';
import { createDbAnswers } from "../../../models/quizAnswerModel";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useInkContext } from '../../../contexts/InkContext';
import {
    Fade,
    Button,
    Box,   
} from '@material-ui/core';
import { MINI_GAME_MAP } from '../../../models/miniGameMap';
// import ReactAudioPlayer from 'react-audio-player';
import AudioPlayer from "../../../music/Music"
import Music from '../../../music/tobeyou_minigame.mp3'
import './MultipleChoiceQuiz.scss';

const useStyles = makeStyles((theme) => ({
    paragraphWrapper: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // backgroundColor: "#6C70DD",
        backgroundImage: ({ image }) => `url('/images/bg_launch.png')`,
        height: '660px',
        [theme.breakpoints.only('xs')]: {
            height: 'calc(var(--vh, 1vh) * 100)',
        },
        bottom: 0, 
        userSelect: "none", 
    },
    background: {
        backgroundImage: ({ image }) => `url('/images/bg_launch.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '660px',
        [theme.breakpoints.only('xs')]: {
            height: 'calc(var(--vh, 1vh) * 100)',
        },
        bottom: 0, 
    
      },
    topLine: {
        position: 'absolute',
        top: 100,
        left: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        padding: 20,
        color: '#fff'
    },
    btn: {
        padding: '10px 50px',
        height: "48px", 
        borderRadius: '40px',
        marginTop: "69px",
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        textDecoration: 'none',
        color: '#664EFC',
        fontWeight: '700',
        '&:hover': {
          backgroundColor: 'lightgrey',      
          boxShadow: 'none',
          
        },
      },
  }))


export default function MultipleChoiceQuiz(props) {

    const { getStory, specialTags } = useInkContext();
    const quiz = MINI_GAME_MAP.filter(x => x.game_id===parseInt(specialTags.game_id))[0];
    const { currentUser } = useAuth();
    const [hasGameStarted,setHasGameStarted] = useState(false);
    const [hasGameEnded,setHasGameEnded] = useState(false);
    const [currentQuestion,setCurrentQuestion] = useState(quiz.questions[0])
    const [currentQuestionNumber,setCurrentQuestionNumber] = useState(1)
    const [score,setScore] = useState(0)
    const [correctAnswered,setCorrectAnswered] = useState(0)
    const [userAnswers,setUserAnswers] = useState([])
    const [isCorrectAnswer,setIsCorrectAnswer] = useState(false);
    const [isDrawerOpen,setIsDrawerOpen]=useState(false);
    const classes = useStyles();  

    useEffect(() => {

    },[])

    const saveUserAnswer = (userAns) => {
        setUserAnswers([...userAnswers, {
            answerId: userAns,
            questionId: currentQuestion.question_id,
        }])
    }

    const continueToStory = async () => {
        const answerDocs = {
            userId: currentUser.id,
            gameId: quiz.game_id,
            answers: userAnswers,
            createdAt: new Date(),
        }
        // console.log(answerDocs);
        try {
            await createDbAnswers(answerDocs);
        } catch (err) {
            throw new Error(`${err}`)
        } finally {
            getStory();
        }
    }

    const nextQuestion = () =>{
        let current = currentQuestionNumber+1;
        if(current <= quiz.questions.length){
            setCurrentQuestionNumber(current)
        }else {
            setHasGameEnded(true);
        }
        setCurrentQuestion(quiz.questions[current-1])
        setIsDrawerOpen(false);
    }

    const checkUserAnswer = (userAns) =>{
        saveUserAnswer(userAns)
        if(currentQuestion.correct_answer_id===userAns){
            setIsCorrectAnswer(true);
            setCorrectAnswered(correctAnswered+1)
            setScore(((correctAnswered +1) / (currentQuestionNumber)) * 100)
        }
        else{
            setIsCorrectAnswer(false);
            setScore(((correctAnswered) / (currentQuestionNumber)) * 100)
        }
        setIsDrawerOpen(true);
     }

    const handleStartGame = () => {
        setHasGameStarted(true);
     }

    return (

        <>
            <AudioPlayer Music={Music} />   
            {quiz.introduction && !hasGameStarted && 
            <Fade in={true} timeout={700}>                
                <Box className={classes.paragraphWrapper} height="100%">               
                <Box className={classes.topLine}>In this segment, we will explore some of the issues covered in the game. </Box>
                <div className="MultipleChoice__text">
                    
                    <Box my={5}>
                        { quiz.introduction}
                    </Box>
                    <Button
                    className={classes.btn}
                    onClick={() => handleStartGame()}
                    >Start Minigame</Button>
                </div>
                </Box>
            </Fade>
            }

            {hasGameStarted && hasGameEnded &&

                <Fade in={true} timeout={700}>
                <Box className={classes.paragraphWrapper}  height="100%">
                <div className="MultipleChoice__text">
                    <Box> 
                        You've scored {correctAnswered} out of {quiz.questions.length}
                    </Box>
                    <Button 
                    variant="contained" 
                    color="primary"
                    className={classes.btn}
                    key="next" onClick={()=>{continueToStory();}} 
                    >
                    Back to Story
                    </Button>
                </div>
                </Box>
                </Fade>
                
            } 

            {hasGameStarted && !hasGameEnded &&
            <Fade in={true} timeout={700}>
            <QuestionPanel 
                question={currentQuestion}
                nextQuestion={nextQuestion}
                total={quiz.questions.length}
                questionNo={currentQuestionNumber}
                checkUserAnswer={checkUserAnswer}
                score={score}
                continueToStory={continueToStory}
                userAnswers={userAnswers}
                isCorrectAnswer={isCorrectAnswer}
                isDrawerOpen={isDrawerOpen}
            /> 
            </Fade>
            }

            
         </>   

        

    )

    
    




}