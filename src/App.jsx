/*  COEN396 - AI Art
*   Final Project
*   March 2023
*   Stephen Tambussi
*/
import './App.css';
import React from 'react';
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
      storyTitle: '',
      userEditorText: '',
      aiEditorText: '',
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
    };

    //Fun variables
    this.highlightedText = "";

    //Method bindings
    this.getAIResponse = this.getAIResponse.bind(this);

  }

  //Method to handle the image generation cases
  async handleImageGen() {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    var prompt; //Prompt variable
    var response;

    //Generate an image prompt from available text
    if (this.state.imagePrompt === '') {
      //Error case when there is nothing for GPT to go off of
      if (this.state.storyTitle === '' && this.state.userEditorText === '') {
        alert('ERROR: please enter some text in the Story Title or Editor Windows.');
        return;
      }

      var tempPrompt;

      tempPrompt = "Write me a one sentence image prompt for a text-to-image AI generator based on this text:\n"
        + this.state.storyTitle + "\n" + this.state.userEditorText;

      this.setState({ genLoading: true })

      response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: tempPrompt },
        ],
      });
      this.setState({ imagePrompt: response.data.choices[0].message.content });
      prompt = response.data.choices[0].message.content
    }

    else {
      this.setState({ genLoading: true })
      prompt = this.state.imagePrompt;
    }

    response = await openai.createImage({
      prompt: prompt,
      n: 1, //num of images to generate
      size: "256x256",
    });

    this.setState({ imageURL: response.data.data[0].url });
    this.setState({ genLoading: false });
  }

  //This method handles the idea and story generation cases
  async handleIdeaOrStoryGen(case_num) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    var prompt; //Prompt variable

    //For random genre generating
    const min = 1;
    const max = 7; //Number of genres possible = length of genres array
    //Generates random int number
    const rand = Math.floor(min + Math.random() * (max - min));
    const genres = ["Mystery", "Science Fiction", "Horror", "Romance", "Fantasy", "Comedy", "True Crime"];

    //Idea Generation case
    if (case_num === 0) {

      prompt = "Give me one idea for a short story in two sentences, the genre is " + genres[rand] + " and include a potential title.";

      console.log(prompt);

      this.setState({ genLoading: true });

      var response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt },
        ],
      });
      this.setState({ aiEditorText: response.data.choices[0].message.content });

      prompt = "Write me a one sentence image prompt for a text-to-image AI generator based on this text:\n" + response.data.choices[0].message.content;
      console.log(prompt);

      response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt },
        ],
      });
      this.setState({ imagePrompt: response.data.choices[0].message.content });

      prompt = response.data.choices[0].message.content;

      response = await openai.createImage({
        prompt: prompt,
        n: 1, //num of images to generate
        size: "256x256",
      });

      this.setState({ imageURL: response.data.data[0].url });
      this.setState({ genLoading: false });
    }

    //Complete story generation case
    else if (case_num === 1) {
      prompt = "Write me a short story. The genre is " + genres[rand] + " and include the title.";

      console.log(prompt);

      this.setState({ genLoading: true });

      var response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt },
        ],
      });
      this.setState({ aiEditorText: response.data.choices[0].message.content });

      prompt = "Write me a one sentence image prompt for a text-to-image AI generator based on this text:\n" + response.data.choices[0].message.content;
      console.log(prompt);

      response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt },
        ],
      });
      this.setState({ imagePrompt: response.data.choices[0].message.content });

      prompt = response.data.choices[0].message.content;

      response = await openai.createImage({
        prompt: prompt,
        n: 1, //num of images to generate
        size: "256x256",
      });

      this.setState({ imageURL: response.data.data[0].url });
      this.setState({ genLoading: false })
    }

  }

  //Method to handle the API calls for the editing functionality
  async handleEditGen() {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    var prompt; //Prompt variable

    this.setState({ editLoading: true });

    //This is probably a bad way to do this, but it works.
    prompt = this.state.editPrompt + "\n" + document.getElementById("selectedText").value;

    console.log(prompt);

    var response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    this.setState({ aiEditorText: response.data.choices[0].message.content });
    this.setState({ editLoading: false });

  }

  //Overarching method for easy code reading
  getAIResponse(button_num) {
    if (button_num === this.Buttons.imageGen) {
      console.log(button_num);
      this.handleImageGen();
    }

    if (button_num === this.Buttons.ideaGen) {
      console.log(button_num);
      this.handleIdeaOrStoryGen(0);
    }

    if (button_num === this.Buttons.completeGen) {
      console.log(button_num);
      this.handleIdeaOrStoryGen(1);
    }

    if (button_num === this.Buttons.editGen) {
      console.log(button_num);
      this.handleEditGen();
    }
  }


  render() {
    const finalizeTooltip = 'Collect the current story title, image, and text in the Editor window and download to PDF';
    const ideaGenTooltip = 'Generate a story idea. NOTE: this will clear any previous generations in the AI Output and Image windows';
    const storyGenTooltip = 'Generate a complete story. NOTE: this will clear any previous generations in the AI Output and Image windows';
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
                        this.getAIResponse(this.Buttons.ideaGen);
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
                        this.getAIResponse(this.Buttons.completeGen);
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

                    /* TODO: add word count and calculate max word count allowed based on tokens */
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
                    this.getAIResponse(this.Buttons.editGen);
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

          </div>

        </div>

      </div>
    );
  }
}

export default App;
