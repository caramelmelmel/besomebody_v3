/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import { Box, Button, Fade, Typography } from '@material-ui/core'
import NextButton from "../../components/NextButton" 
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useInkContext } from '../../contexts/InkContext'

import "./style.scss"
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

const useStyles = makeStyles((theme) => ({
  paragraphWrapper: {
    backgroundImage: ({ image }) => `url('/images/${image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '660px',
    [theme.breakpoints.only('xs')]: {
        height: `calc(var(--vh, 1vh) * 100)`,
    },
    bottom: 0, 
  },
  textWrapper: {
    background: theme.palette.grey[100],
    opacity: 0.9,
    position: 'relative',
    top: '350px',
    height: '150px',
    scrollSnapType: 'y mandatory',
  },
  choicesButton: {
    width: "330px", 
    height: "48px", 
    margin: "auto", 
    borderRadius: "24px", 
    border: "solid 1px #3DCAD328", 
    backgroundColor: "white", 
    color: "#0B6E7D", 
    marginBottom: "12px", 
    '&:hover': {
      backgroundColor: '#B1EAEE',
      borderColor: '#B1EAEE',
      boxShadow: 'none',
    },
  },
}))
 
const Narrator = (props) => {
  const { currentParagraphs } = props
  const { getStory, choices, setChoice, specialTags } = useInkContext()
  const classes = useStyles({ image: specialTags.background })  
  
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
   
  const step = currentParagraphs[currentParagraphs.length - 1]
  // console.log(step)

  return (
    <div>
        <Fade in={true} timeout={700}>

        <Box className={classes.paragraphWrapper}  height="100%">
          { step && (
            <Fade in={step.text} timeout={700}>
              <div className="Narrator__text">
                { step.tags[0] === 'title' ? 
                  step.text.toUpperCase():
                  step.text
                } 
              </div>
            </Fade>

            
            )
          }   

          <div ref={elementRef} />
          {/* this if else is needed to toggle between "Next Button" and choices (if any) */}
          {choices.length > 0 ? 
            <div className="Narrator__choicesWrapper" >            
              {choices.map((choice) => (
                
                <Box
                    // mx={1}
                    key={choice.text}
                    // display="flex"
                    // justifyContent="center"
                    // my={1}
                    className="Narrator__choicesWrapper__choices"
                  
                  >
                    <Fade in={choice.text?true:false} timeout={700}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.choicesButton}
                        onClick={() => setChoice(choice.index)}
                      >
                        <Typography variant="caption">{choice.text}</Typography>
                      </Button>
                    </Fade>
                  </Box>
                  
              ))}
            </div>
            : 
            <NextButton getStory={getStory}/>

          }
      </Box>
      
    </Fade>
      </div>
        
  )
}

export default Narrator
