/*  COEN396 - AI Art
*   Final Project
*   March 2023
*   Stephen Tambussi
*/
import './App.css';
import React from 'react';
import { ReactNotifications, Store } from 'react-notifications-component';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import 'animate.css/animate.min.css';
/*  TODOs
*   - see todos in code
*   - figure out how to get notifications only in specific areas of website
*   - figure out how to capture highlighted section and modify with GPT
*/
class App extends React.Component {
  constructor(props) {
    super(props);

    //State variables
    this.state = {
      tokens_remaining: 4000, //Change depending on engine -- current engine is text-davinci-002 (best one)
      storyTitle: '',
      userEditorText: '',
      aiEditorText: '',
      storytext_cnt: 0,
      imagePrompt: '',
      imagePromptGen: false,
      helpOpen: false,
      editPrompt: '',
      editGen: false,
      finalize: false,
      ideaGen: false,
      completeGen: false,
      // messages: [],
    };
  }

  //GPT method
  async getGPTResponse(button_num) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      //Insert your OpenAI API Key here to try this out
      apiKey: 'API Key',
    });
    const openai = new OpenAIApi(configuration);
    if (this.state.userEditorText === '') {
      alert('ERROR: World Information cannot be blank');
      return;
    }
    //TODO: conditionals for specific button presses and image generation
  }

  render() {
    // const traitstatus = this.state.traitstatus;
    // const skillstatus = this.state.skillstatus;
    // const personalitystatus = this.state.personalitystatus;
    // const lifeinfostatus = this.state.lifeinfostatus;
    // const send_msgstatus = this.state.send_msgstatus;
    return (
      <div className="App">


        <header className="App-header">
          <ReactNotifications className="Notification" /> {/* TODO: update notification to be nicer or change to loading symbol */}
          <div className="App-subheader">
            <h1 className="Title"><a href="https://github.com/stephentambussi/StoryGenius">StoryGenius</a></h1>
            <h2 className="SubTitle">An AI-Powered Story Creator</h2>
          </div>
          <Button sx={{ bgcolor: 'darkorange', }} variant="contained" onClick={() => this.setState({ helpOpen: !this.state.helpOpen })}>Help</Button>
        </header>


        <Dialog open={this.state.helpOpen} onClose={() => this.setState({ helpOpen: !this.state.helpOpen })} scroll={'paper'}>
          <DialogTitle>Usage Guide</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText>
              TODO: fill out this usage guide
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ helpOpen: !this.state.helpOpen })}>Close</Button>
          </DialogActions>
        </Dialog>


        <div className="StoryTemplate">


          <div className="StoryPartition">

            <Button sx={{ color: 'white', bgcolor: 'green', marginBottom: 45, marginLeft: 1, marginRight: 5, marginTop: 1, padding: 2, }}
              variant="contained" onClick={() => this.setState({ finalize: !this.state.finalize })}>Finalize</Button>

            <div className="CenterPartition">

              <TextField label="Story Title" fullWidth inputProps={{ min: 0, style: { textAlign: 'center', fontSize: 30 } }} size="small"
                sx={{
                  bgcolor: 'white',
                  marginTop: 2,
                  maxWidth: '70%',
                }}
                value={this.state.storyTitle}
                onChange={(event) => this.setState({ storyTitle: event.target.value })}></TextField>

              <div className="ImageBox">

                <h2 className="ImageBoxHeader">Image</h2>

                <div className="frame">
                  {/* TODO: Add image here after being generated */}
                </div>

                <div className="promptArea">
                  <TextField label="Image Prompt" size="small"
                    sx={{
                      marginTop: 1,
                      bgcolor: 'white',
                      width: 600,
                      maxWidth: '60%',
                    }}
                    value={this.state.imagePrompt}
                    onChange={(event) => this.setState({ imagePrompt: event.target.value })}></TextField>
                  <Button size="small" sx={{ color: 'white', bgcolor: 'gray', marginTop: 1, }} variant="contained" onClick={() => this.setState({ imagePromptGen: !this.state.imagePromptGen })}>Generate</Button>
                </div>

              </div>

            </div>

            <div className="GenerationButtons">
              <h2 className="ImageBoxHeader">Generative Options</h2>
              <Button sx={{ color: 'white', bgcolor: 'gray', marginTop: 1, marginRight: 1, }} variant="contained" onClick={() => this.setState({ ideaGen: !this.state.ideaGen })}>Idea</Button>
              <Button sx={{ color: 'white', bgcolor: 'gray', marginTop: 1, marginRight: 1, }} variant="contained" onClick={() => this.setState({ completeGen: !this.state.completeGen })}>Story</Button>
            </div>

          </div>


          <div className="Editor">

            <div className="TextEditors">

              <div className="UserEditor">
                <h2 className="UserEditorHeader">Editor</h2>
                <TextField fullWidth label="Write your story here" size="small" multiline={true} rows="8"
                  sx={{
                    bgcolor: 'white',
                  }}
                  value={this.state.userEditorText}
                  onChange={(event) => {
                    this.setState({ userEditorText: event.target.value });
                    this.setState({ storytext_cnt: Math.floor(event.target.value.length / 4) }); /* TODO: make this word count and calculate max word count allowed based on tokens? */
                  }}></TextField>
              </div>

              <div className="AIEditor">
                <h2 className="AIEditorHeader">AI Output</h2>
                <TextField fullWidth label="GPT Output" size="small" multiline={true} rows="8"
                  sx={{
                    bgcolor: 'white',
                  }}
                  value={this.state.aiEditorText}
                  onChange={(event) => {
                    this.setState({ aiEditorText: event.target.value });
                  }}></TextField>
              </div>

            </div>

            <div className="EditingOptions">

              <h2 className="OptionsHeader">Editing Options</h2>
              <p className="OptionsSubHeader">Instructions: <i>highlight text in the 'Editor' box, enter a command below, and then press the edit button.</i></p>

              <div className="CommandPrompt">
                <TextField fullWidth label="Edit Command" size="small"
                  sx={{
                    maxWidth: '85%',
                    bgcolor: 'white',
                    marginBottom: 2,
                  }}
                  value={this.state.editPrompt}
                  onChange={(event) => this.setState({ editPrompt: event.target.value })}></TextField>
                <Button size="small" sx={{ color: 'white', bgcolor: 'gray', marginBottom: 2, }} variant="contained" onClick={() => this.setState({ editGen: !this.state.editGen })}>Edit</Button>
              </div>

              <h2 className="ExamplesHeader">Example Edit Commands</h2>
              <p className="ExamplesSubHeader"><b>Grammar: </b><i>"remove any grammatical errors."</i></p>
              <p className="ExamplesSubHeader"><b>Genre: </b><i>"change this story's genre to horror."</i></p>
              <p className="ExamplesSubHeader"><b>Tone: </b><i>"rewrite this sentence in a rude tone."</i></p>
              <p className="ExamplesSubHeaderT"><b>Finish Story: </b><i>"add an ending to this story."</i></p>

            </div>

            <label htmlFor="story_textbox" name="StoryTextBoxTitle"><b>Tokens: {this.state.storytext_cnt} / {this.state.tokens_remaining}</b></label>

          </div>

        </div>

      </div>
    );
  }
}

export default App;
