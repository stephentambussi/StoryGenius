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
import { RotatingLines } from 'react-loader-spinner';
import 'animate.css/animate.min.css';
/*  TODOs
*   - see todos in code
*   - Include notification only for errors like: missing api key, etc.
*/

/*  Implementation notes:
*   Everything that makes StoryGenius work is in this file such as the UI components, logic, and API calls. 
*   App.css includes styling to make it look the way I wanted it to. There is definitely a better way to do
*   all of this, but it works.
*/

//Gets and returns the selected/highlighted text in the current window 
function getSelectionText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
}

//Main Class
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
      helpOpen: false,
      editPrompt: '',
      finalize: false, //MAYBE change to enum?
      genLoading: false, //Variables to enable rendering of loading icons
      editLoading: false,
      imageURL: '',
      // images: [], //TODO: this is a stretch goal, but save images to array and allow user to go back to previously generated ones
    };

    //Enums for button
    this.Buttons = {
      imageGen: 0,
      ideaGen: 1,
      completeGen: 2,
      editGen: 3
    }

    //Fun variables
    this.highlightedText = "";

  }

  //Method to use OpenAI API to call ChatGPT (GPT3.5) and DALL-E 2
  async getAIResponse(button_num) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      //Insert your OpenAI API Key here to try this out
      //apiKey: 'API Key',
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    /*
    if (this.state.userEditorText === '') {
      alert('TODO: make error');
      return;
    }
    */

    //TODO: conditionals for specific button presses and image generation

    /* Example chatgpt get response code
    if(....) {
      this.setState({genLoading: true})
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Prompt here"}],
      });
      this.setState({genLoading: false})
      this.setState({storyTitle: this.state.storyTitle + response.data.choices[0].message});
    }
    */

    //DALLE generate code
    //TODO: update this conditional so that it handles all cases outlined in planning document
    if (button_num === this.Buttons.imageGen) {
      //console.log(button_num);
      this.setState({genLoading: true});
      const response = await openai.createImage({
        prompt: this.state.imagePrompt,
        n: 1, //num of images to generate
        size: "256x256",
      });
      this.setState({ imageURL: response.data.data[0].url });
      this.setState({ genLoading: false });
    }
  }

  render() {
    const finalizeTooltip = 'Collect the current story title, image, and text in the Editor window and download to PDF';
    const ideaGenTooltip = 'Create a story idea. NOTE: this will clear any previous generations';
    const storyGenTooltip = 'Generate a complete story. NOTE: this will clear any previous generations';
    const imagePromptGenTooltip = 'Generate an image from the prompt OR if it is empty, generate a prompt and image from available text';
    //Booleans for loading icons
    const genLoading = this.state.genLoading;
    const editLoading = this.state.editLoading;

    if (sessionStorage.getItem("storyTitleAutosave")) {
      this.state.storyTitle = sessionStorage.getItem("storyTitleAutosave");
    }

    //Checks to see if there is an autosave value
    //This only happens when there is a page reload or restore
    //(Enables semi-persistence for user work, but does not persist if tab/window is closed)
    if (sessionStorage.getItem("editorAutosave")) {
      //Restore contents of Editor Textfield
      this.state.userEditorText = sessionStorage.getItem("editorAutosave");
    }

    //Event listener function for selecting/highlighting text
    document.onmouseup = document.onkeyup = document.onselectionchange = function () {
      if (document.activeElement.id === "editorWindow") { //Only the editor window/textfield can select and capture text
        this.highlightedText = getSelectionText();
        document.getElementById("selectedText").value = this.highlightedText;
      }
    }

    return (
      <div className="App">


        <header className="App-header">
          <ReactNotifications className="Notification" /> {/* TODO: update notification to be nicer */}
          <div className="genLoading">
            {genLoading &&    //Conditional rendering
              <div>
                <RotatingLines
                  strokeColor="orange"
                  strokeWidth="4"
                  width="65"
                ></RotatingLines>
              </div>
            }
          </div>

          <div className="App-subheader">
            <h1 className="Title"><a href="https://github.com/stephentambussi/StoryGenius">StoryGenius</a></h1>
            <h2 className="SubTitle">An AI-Powered Story Creator</h2>
          </div>
          <Button sx={{ bgcolor: 'darkorange', marginRight: '2%', }} variant="contained" onClick={() => this.setState({ helpOpen: !this.state.helpOpen })}>Help</Button>
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


            <div className="TopPartition">

              <div className="finalizeBtn">
                <Tooltip TransitionComponent={Zoom} title={finalizeTooltip}>
                  <Button sx={{ color: 'white', bgcolor: 'green', padding: 2, }}
                    variant="contained" onClick={() => this.setState({ finalize: !this.state.finalize })}>Finalize</Button>
                </Tooltip>
              </div>

              <TextField label="Story Title" fullWidth inputProps={{ min: 0, style: { textAlign: 'center', fontSize: 30 } }} size="small"
                sx={{
                  bgcolor: 'white',
                  maxWidth: '100%',
                }}
                value={this.state.storyTitle}
                onChange={(event) => {
                  this.setState({ storyTitle: event.target.value })
                  sessionStorage.setItem("storyTitleAutosave", event.target.value);
                }}></TextField>


              <div className="GenerationButtons">

                <h2 className="generationButtonsHeader">Generation Options</h2>

                <div className="GenerationButtonsSub">
                  <Tooltip TransitionComponent={Zoom} title={ideaGenTooltip}>
                    <Button
                      sx={{
                        color: 'white',
                        bgcolor: 'gray',
                        marginRight: 1,
                      }}
                      variant="contained"
                      onClick={() => {
                        console.log(this.Buttons.ideaGen);
                      }}>Idea</Button>
                  </Tooltip>

                  <Tooltip TransitionComponent={Zoom} title={storyGenTooltip}>
                    <Button
                      sx={{
                        color: 'white',
                        bgcolor: 'gray',
                        marginLeft: 1,
                      }}
                      variant="contained"
                      onClick={() => {
                        console.log(this.Buttons.completeGen);
                      }}>Story</Button>
                  </Tooltip>
                </div>

              </div>

            </div>

            <div className="ImageBox">

              <h2 className="ImageBoxHeader">Image</h2>

              <div className="outerFrame">
                <div className="frame">
                  <img id="img" src={this.state.imageURL} alt=""></img>
                </div>
              </div>

              <div className="promptArea">
                <TextField label="Image Prompt" size="small"
                  sx={{
                    marginTop: 1,
                    bgcolor: 'white',
                    width: 512,
                    maxWidth: '70%',
                  }}
                  value={this.state.imagePrompt}
                  onChange={(event) => this.setState({ imagePrompt: event.target.value })}></TextField>
                <Tooltip TransitionComponent={Zoom} title={imagePromptGenTooltip}>
                  <Button size="small"
                    sx={{
                      color: 'white',
                      bgcolor: 'gray',
                      marginTop: 1,
                    }}
                    variant="contained"
                    onClick={() => {
                      //console.log(this.Buttons.imageGen)
                      this.getAIResponse(this.Buttons.imageGen);
                    }}>Generate</Button>
                </Tooltip>
              </div>

            </div>

          </div>


          <div className="Editor">

            <div className="TextEditors">

              <div className="UserEditor">
                <h2 className="UserEditorHeader">Editor</h2>
                <TextField id="editorWindow" fullWidth label="Write your story here" size="small" multiline={true} rows="8"
                  sx={{
                    bgcolor: 'white',
                  }}
                  value={this.state.userEditorText}
                  onChange={(event) => {
                    this.setState({ userEditorText: event.target.value });
                    //Save results into session storage object for semi-persistence
                    sessionStorage.setItem("editorAutosave", event.target.value);

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
              <p className="OptionsSubHeader"><b>Instructions: </b><i>highlight text in the 'Editor' window, enter a command below, and then press the EDIT button.</i></p>

              <textarea disabled className="selectedText" id="selectedText" rows="3" cols="100" placeholder="Highlighted text"></textarea>

              <div className="CommandPrompt">
                <TextField fullWidth label="Command" size="small"
                  sx={{
                    maxWidth: '50%',
                    bgcolor: 'white',
                    marginBottom: 2,
                    marginLeft: 2,
                  }}
                  value={this.state.editPrompt}
                  onChange={(event) => this.setState({ editPrompt: event.target.value })}></TextField>
                <Button size="small"
                  sx={{
                    color: 'white',
                    bgcolor: 'gray',
                    marginBottom: 2,
                  }}
                  variant="contained"
                  onClick={() => {
                    console.log(this.Buttons.editGen);
                  }}>Edit</Button>
                <div className="editLoading">
                  {editLoading &&
                    <div>
                      <RotatingLines
                        strokeColor="black"
                        strokeWidth="4"
                        width="40"
                      ></RotatingLines>
                    </div>
                  }
                </div>
              </div>

              <h2 className="ExamplesHeader">Example Commands</h2>
              <p className="ExamplesSubHeader"><i>"Remove any grammatical errors."</i></p>
              <p className="ExamplesSubHeader"><i>"Change this story's genre to horror."</i></p>
              <p className="ExamplesSubHeader"><i>"Rewrite this sentence in a rude tone."</i></p>
              <p className="ExamplesSubHeaderT"><i>"Add an ending to this story."</i></p>

            </div>

            <label htmlFor="story_textbox" name="StoryTextBoxTitle"><b>Tokens: {this.state.storytext_cnt} / {this.state.tokens_remaining}</b></label>

          </div>

        </div>

      </div>
    );
  }
}

export default App;
