/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import { Box, Button, Fade, Typography } from '@material-ui/core'
import NextButton from "../../components/NextButton" 
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useInkContext } from '../../contexts/InkContext'
import { useParams } from 'react-router-dom'
import "./style.scss"


const useStyles = makeStyles((theme) => ({
  paragraphWrapper: {
    backgroundImage: ({ image }) => `url('/images/${image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '640px',
    bottom: 0, 
  },
  // textWrapper: {
  //   background: theme.palette.grey[100],
  //   opacity: 0.9,
  //   position: 'relative',
  //   top: '350px',
  //   height: '150px',
  //   scrollSnapType: 'y mandatory',
  // },
  choiceWrapper: {
    position: 'relative',
    opacity: 0.8,    
    top: '400px',
  }
}))

const Scene = (props) => {
  const { currentParagraphs } = props
  const { getStory, choices, setChoice, specialTags } = useInkContext()
  const classes = useStyles({ image: specialTags.background })
  const { name } = useParams()

  // ========================================================
  // Help to scroll to bottom of the paragraphs render screen
  // ========================================================
  const elementRef = useRef()

  // Eveytime currentParagraphs gets updated or choices appear, scroll to the elementRef
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [elementRef, currentParagraphs, choices])

  if (currentParagraphs.length < 1) {
    getStory();
  }
   
  const step = currentParagraphs[currentParagraphs.length - 1]
  // if step includes speaker left/right, set name here  
  const amanimg = "/images/test/avatar.png"
  const otherimg = "/images/test/waiter.png"

  return (
    <Fade in>
      <div className="ScenePage">
        <div className="ScenePage__speaker">
          {step.tags[0] === 'speaker_left' || 'speaker_self' ? <img src={amanimg} className="ScenePage__speaker--left"/> : null}
          {step.tags[0] === 'speaker_right' ? <img src={otherimg} className="ScenePage__speaker--right"/> : null}
          
        </div>
      <Box className={classes.paragraphWrapper}  height="100%">
        <div
          className={`ScenePage__textWrapper ${step.tags[0]==='inner_monologue'?"innerMonologue":"default"}`}
          overflow="scroll"
          >
            {step && (
              <Box my={1} key={step.text} style={{ scrollSnapAlign: 'start' }}>
                <Typography variant="overline">
                  {step.tags[0] === 'speaker_left' ? specialTags.speaker_left_name : null}
                  {step.tags[0] === 'speaker_right' ? specialTags.speaker_right_name : null}
                  {step.tags[0]==='speaker_self'? name:null}
                  {step.tags[0]==='inner_monologue'? 'Inner Monologue':null}
                </Typography>
                <Fade in={step.text}>
                    <Typography>{step.text}</Typography>
                  </Fade>
              </Box>
              )
            }            

          <div ref={elementRef} />
        {/* this if else is needed to toggle between "Next Button" and choices (if any) */}
        {choices.length > 0 ? 
          <div  className="ScenePage__choicesWrapper" >            
            {choices.map((choice) => (
              
              <Box
                  key={choice.text}
                  className="ScenePage__choicesWrapper__choices"
                >
                  <Fade in={choice.text}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setChoice(choice.index)}
                    >
                      <Typography variant="caption">{choice.text}</Typography>
                    </Button>
                  </Fade>
                </Box>
                
            ))}
          </div>
          : 
          <NextButton getStory={getStory} />

        }
        </div>
      </Box>
      
      </div>
        
    </Fade>
  )
}

export default Scene
