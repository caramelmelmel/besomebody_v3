import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,     
    FormLabel,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    TextField,
    Typography,
    Container,
} from '@material-ui/core'
import { useAuth } from '../../contexts/AuthContext'
import { Link , useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {  updateDbUser } from '../../models/userModel'
import { useSnackbar } from '../../contexts/SnackbarContext'
  


const useStyles = makeStyles((theme) => ({
    link: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
    wrapper: {
      height: '660px',
      overflow: 'scroll',    
      },
  }))
  

const ProfileBuilderPage = () => {

    const history = useHistory()
    
    const classes = useStyles()
    
    // Auth Context
    const { currentUser } = useAuth()  
    
    const { setSnackbar } = useSnackbar()

    // form submission in progress
    const [isLoading, setIsLoading] = useState(false)

    const initialFormData = Object.freeze({
        age: "",
        gender: "",
        race: "",
        religion: "",
        housing: "",
        username:"",
    });
  
    const [formData, updateFormData] = React.useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
          ...formData,
    
          // Trimming any whitespace and convert to uppercase for standardisation
          [e.target.name]: e.target.value.trim().toUpperCase()
        });        
    };
 
  
    const handleSubmit = async (e) => {
        e.preventDefault()
         
        // console.log(formData);        
        
        try {
          setIsLoading(true)          
          await updateDbUser(formData, currentUser.id)
          history.push('/')  // redirect to root which will be the characterchoice page now.
         
        } catch (err) {
          setSnackbar({
            message: `There was an error: ${err.message}`,
            open: true,
            type: 'error',
          })
        }
        setIsLoading(false)      
 
    };
    

    return (
    <Box className={classes.wrapper}>
      <section>
        <Container maxWidth="md">
          <Box py={2} textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom={true}>Profile Builder </Typography>
              <Typography variant="h6" color="textSecondary" paragraph={true}>The form to build the user profile / demographics goes here, and this will push to the UserDB model </Typography>
              <Typography variant="body" color="textSecondary" paragraph={true}> All fields are recommended but not compulsory { currentUser.id }</Typography>
          </Box>
          <Box mx="auto" width="75%" my={4}>
            <form onSubmit={handleSubmit}>
              

              <Box my={4}>
                <FormLabel component="legend">Age</FormLabel>                               
                <RadioGroup aria-label="age"  name="age" onChange={handleChange}  >
                    <FormControlLabel value="16" control={<Radio />} label="Under 16" />
                    <FormControlLabel value="19" control={<Radio />} label="16 to 19" />
                    <FormControlLabel value="20" control={<Radio />} label="20-29" />
                    <FormControlLabel value="30" control={<Radio />} label="30-39" />
                    <FormControlLabel value="40" control={<Radio />} label="40-49" />
                    <FormControlLabel value="50" control={<Radio />} label="50-59" />
                    <FormControlLabel value="60" control={<Radio />} label="Above 60" />  
                </RadioGroup>                
              </Box>

              <Box my={4}>
                <FormLabel component="legend">Gender</FormLabel>                              
                <RadioGroup aria-label="gender" name="gender"  onChange={handleChange} >
                  <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                  <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
                  <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
                    {formData.gender === 'OTHER' && <input type="text" placeholder="Other" name="gender" onBlur={handleChange} ></input>}
                  {/* Using onBlur instead of onChange because once changed, the text field disappears. So need to capture the data only once the user moves away. */ }
                </RadioGroup>
              </Box>

              <Box my={4}>
                <FormLabel component="legend">Race</FormLabel>                              
                <RadioGroup aria-label="race" name="race"  onChange={handleChange} >
                  <FormControlLabel value="CHINESE" control={<Radio />} label="Chinese" />
                  <FormControlLabel value="MALAY" control={<Radio />} label="Malay" />
                  <FormControlLabel value="INDIAN" control={<Radio />} label="Indian" />
                  <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
                  {formData.race === 'OTHER' && <input type="text" placeholder="e.g. Chinese-Indian , Eurasian" name="race" onBlur={handleChange} ></input>} 
                </RadioGroup>
              </Box>                

              <Box my={4}>
                <FormLabel component="legend">Religion</FormLabel>                              
                <RadioGroup aria-label="religion" name="religion"  onChange={handleChange} >
                  <FormControlLabel value="CHRISTIAN" control={<Radio />} label="Christian" />
                  <FormControlLabel value="HINDU" control={<Radio />} label="Hindu" />
                  <FormControlLabel value="BUDDHIST" control={<Radio />} label="Buddhist" />
                  <FormControlLabel value="TAOIST" control={<Radio />} label="Taoist" />
                  <FormControlLabel value="MUSLIM" control={<Radio />} label="Muslim" />
                  <FormControlLabel value="SIKH" control={<Radio />} label="Sikh" />
                  <FormControlLabel value="FREE-THINKER" control={<Radio />} label="Free-thinker" />                  
                  <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
                  {formData.religion === 'OTHER' && <input type="text" placeholder="e.g. Chinese-Indian , Eurasian" name="religion" onBlur={handleChange} ></input>} 
                </RadioGroup>
              </Box>    
               
              <Box my={4}>
                <FormLabel component="legend">Housing Type</FormLabel>                              
                <RadioGroup aria-label="housing" name="housing"  onChange={handleChange} >
                  <FormControlLabel value="HDB" control={<Radio />} label="HDB" />
                  <FormControlLabel value="CONDO" control={<Radio />} label="Condominium" />
                  <FormControlLabel value="LANDED" control={<Radio />} label="Landed" />                                     
                  <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
                  {formData.housing === 'OTHER' && <input type="text" placeholder="e.g. Bungalow" name="housing" onBlur={handleChange} ></input>} 
                </RadioGroup>
              </Box>     

              <Box my={4}>
                <FormLabel component="legend">Preferred Username </FormLabel>                              
                  <input type="text" placeholder="e.g. FLYBOY21" name="username" onBlur={handleChange} ></input>                 
              </Box> 
              
              <Box my={4}>
                <Typography variant="body2">Your submitted profile is:</Typography>
                <div>Age: {formData.age}</div>
                <div>Gender: {formData.gender.toUpperCase()}</div>
                <div>Race: {formData.race.toUpperCase()}</div>
                <div>Religion: {formData.religion.toUpperCase()}</div>
                <div>Housing Type: {formData.housing.toUpperCase()}</div>
                <div>Username: {formData.username.toUpperCase()}</div>                
              </Box>
              
              
              <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  Submit - then Start the game
              </Button>

            </form>
            
          </Box>
         
        </Container>
      </section>
      
       
    </Box>
    );
}
 
export default ProfileBuilderPage;