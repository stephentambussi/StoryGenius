/*  COEN396 - AI Art
*   Final Project
*   March 2023
*   Stephen Tambussi
*/
import './App.css';
import React from 'react';
import { ReactNotifications, Store } from 'react-notifications-component';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
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
      imageURL: '',
      // images: [], //TODO: this is a stretch goal, but save images to array and allow user to go back to previously generated ones
    };
  }

  //Method to use OpenAI API to call ChatGPT (GPT3.5) and DALL-E 2
  async getAIResponse(button_num) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      //Insert your OpenAI API Key here to try this out
      apiKey: 'API Key',
    });
    const openai = new OpenAIApi(configuration);
    if (this.state.userEditorText === '') {
      alert('TODO: make error');
      return;
    }
    //TODO: conditionals for specific button presses and image generation

    /* Example chatgpt get response code
    if(....) {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Prompt here"}],
      });
      this.setState({storyTitle: this.state.storyTitle + response.data.choices[0].message});
    }
    */

    /* Example DALLE generate code
    if(....) {
      const response = await openai.createImage({
        prompt: "image gen prompt",
        n: 1, //num of images to generate
        size: "256x256",
      });
      this.setState({imageURL: response.data.data[0].url});
    }
    */
  }

  render() {
    // const traitstatus = this.state.traitstatus;
    const finalizeTooltip = 'Collect the current story title, image, and text in the Editor window and download to PDF';
    const ideaGenTooltip = 'Create a story idea. NOTE: this will clear any previous generations';
    const storyGenTooltip = 'Generate a complete story. NOTE: this will clear any previous generations';
    const imagePromptGenTooltip = 'Generate an image from the prompt OR if it is empty, generate a prompt and image from available text';
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

            <Tooltip TransitionComponent={Zoom} title={finalizeTooltip}>
              <Button sx={{ color: 'white', bgcolor: 'green', marginBottom: 45, marginLeft: 1, marginRight: 5, marginTop: 1, padding: 2, }}
                variant="contained" onClick={() => this.setState({ finalize: !this.state.finalize })}>Finalize</Button>
            </Tooltip>

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
                  <Tooltip TransitionComponent={Zoom} title={imagePromptGenTooltip}>
                    <Button size="small" sx={{ color: 'white', bgcolor: 'gray', marginTop: 1, }} variant="contained" onClick={() => this.setState({ imagePromptGen: !this.state.imagePromptGen })}>Generate</Button>
                  </Tooltip>
                </div>

              </div>

            </div>

            <div className="GenerationButtons">

              <h2 className="ImageBoxHeader">Generative Options</h2>

              <Tooltip TransitionComponent={Zoom} title={ideaGenTooltip}>
                <Button sx={{ color: 'white', bgcolor: 'gray', marginTop: 1, marginRight: 1, }} variant="contained" onClick={() => this.setState({ ideaGen: !this.state.ideaGen })}>Idea</Button>
              </Tooltip>

              <Tooltip TransitionComponent={Zoom} title={storyGenTooltip}>
                <Button sx={{ color: 'white', bgcolor: 'gray', marginTop: 1, marginRight: 1, }} variant="contained" onClick={() => this.setState({ completeGen: !this.state.completeGen })}>Story</Button>
              </Tooltip>

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
              <p className="OptionsSubHeader">Instructions: <i>highlight text in the 'Editor' window, enter a command below, and then press the EDIT button.</i></p>

              <div className="CommandPrompt">
                <TextField fullWidth label="Command" size="small"
                  sx={{
                    maxWidth: '85%',
                    bgcolor: 'white',
                    marginBottom: 2,
                  }}
                  value={this.state.editPrompt}
                  onChange={(event) => this.setState({ editPrompt: event.target.value })}></TextField>
                <Button size="small" sx={{ color: 'white', bgcolor: 'gray', marginBottom: 2, }} variant="contained" onClick={() => this.setState({ editGen: !this.state.editGen })}>Edit</Button>
              </div>

              <h2 className="ExamplesHeader">Example Commands</h2>
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
