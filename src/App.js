/*  COEN396 - AI Art
*   Final Project
*   March 2023
*   Stephen Tambussi
*/
import './App.css';
import React from 'react';
import { ReactNotifications, Store } from 'react-notifications-component';
import 'animate.css/animate.min.css';
/*  TODOs
*   - see todos in code
*   - figure out how to get notifications only in specific areas of website
*   - figure out how to capture highlighted section and modify with GPT
*/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens_remaining: 4000, //Change depending on engine -- current engine is text-davinci-002 (best one)
      storytext: '',
      storytext_cnt: 0,
      imageprompt: '',
      // traitstatus: false, //false for statuses means prior text area needs to be filled in before continuing
      // basictraits: '',
      // basictraits_cnt: 0,
      // skillstatus: false,
      // skills: '',
      // skills_cnt: 0,
      // personalitystatus: false,
      // personality: '',
      // personality_cnt: 0,
      // lifeinfostatus: false,
      // lifeinfo: '',
      // lifeinfo_cnt: 0,
      // send_msgstatus: false,
      // send_msg: '',
      // messages: [],
      // is_typing: false,
    };

    this.handleStoryChange = this.handleStoryChange.bind(this);
    this.handlePromptChange = this.handlePromptChange.bind(this);
    this.handleImageGenClick = this.handleImageGenClick(this);
    this.handleIdeaGenBtn = this.handleIdeaGenBtn(this);
    this.handlePartialGenBtn = this.handlePartialGenBtn(this);
    this.handleCompleteGenBtn = this.handleCompleteGenBtn(this);
    this.handleToneEditBtn = this.handleToneEditBtn(this);
    this.handleGenreEditBtn = this.handleGenreEditBtn(this);
    this.handleErrorEditBtn = this.handleErrorEditBtn(this);
  }

  async getGPTResponse(button_num) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      //Insert your OpenAI API Key here to try this out
      apiKey: 'API Key',
    });
    const openai = new OpenAIApi(configuration);
    if (this.state.storytext === '') {
      alert('ERROR: World Information cannot be blank');
      return;
    }
    //TODO: conditionals for specific button presses and image generation
    // //Basic Traits Section
    // if(button_num === 0 && this.state.basictraits === '') { //If basic traits is empty when clicking generate
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 1500,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + 'Generate the name, age, gender, and physical appearance of a character in this world:',
    //     temperature: 0.7,
    //     max_tokens: 256,
    //   });
    //   this.setState({basictraits: this.state.basictraits + response.data.choices[0].text})
    //   this.setState({skillstatus: true});
    // }

    // else if(button_num === 0) { //If basic traits has some info in it already
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 1500,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + 'Generate the name, age, gender, and physical appearance of a character in this world if these do not already exist:',
    //     temperature: 0.65,
    //     max_tokens: 256,
    //   });
    //   this.setState({basictraits: this.state.basictraits + response.data.choices[0].text})
    //   this.setState({skillstatus: true});
    // }

    // //Skills Section
    // if(button_num === 1 && this.state.basictraits === '') { //basic traits cannot be empty when working on Skills
    //   alert('ERROR: basic traits must be filled in before skills');
    //   return;
    // }

    // else if(button_num === 1 && this.state.skills === '') { //If skills are empty when clicking generate
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 2000,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + 'Generate the physical and intellectual skills of this character:',
    //     temperature: 0.5,
    //     max_tokens: 256,
    //   });
    //   this.setState({skills: this.state.skills + response.data.choices[0].text})
    //   this.setState({personalitystatus: true});
    // }

    // else if(button_num === 1) { //If skills has some info in it already
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 2000,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + this.state.skills + 'Generate the physical and intellectual skills of this character if these do not already exist:',
    //     temperature: 0.5,
    //     max_tokens: 256,
    //   });
    //   this.setState({skills: this.state.skills + response.data.choices[0].text})
    //   this.setState({personalitystatus: true});
    // }

    // //Personality Section
    // if(button_num === 2 && this.state.skills === '') { //skills cannot be empty when working on personality
    //   alert('ERROR: skills must be filled in before personality');
    //   return;
    // }

    // else if(button_num === 2 && this.state.personality === '') { //If personality is empty when clicking generate
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 3000,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + this.state.skills 
    //       + 'Generate the personality of this character such as their interests, behavioral quirks, and standard personality traits:',
    //     temperature: 0.8,
    //     max_tokens: 256,
    //   });
    //   this.setState({personality: this.state.personality + response.data.choices[0].text})
    //   this.setState({lifeinfostatus: true});
    // }

    // else if(button_num === 2) { //If personality has some info in it already
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 3000,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + this.state.skills + this.state.personality 
    //       + 'Generate the personality of this character such as their interests, behavioral quirks, and standard personality traits if these do not already exist:',
    //     temperature: 0.75,
    //     max_tokens: 256,
    //   });
    //   this.setState({personality: this.state.personality + response.data.choices[0].text})
    //   this.setState({lifeinfostatus: true});
    // }

    // //Life Info Section
    // if(button_num === 3 && this.state.personality === '') { //personality cannot be empty when working on life info
    //   alert('ERROR: personality must be filled in before life info');
    //   return;
    // }

    // else if(button_num === 3 && this.state.lifeinfo === '') { //If life info is empty when clicking generate
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 5000,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + this.state.skills + this.state.personality
    //       + 'Generate the life history of this character such as their major life events, occupation, family, and relationships:',
    //     temperature: 0.7,
    //     max_tokens: 512,
    //   });
    //   this.setState({lifeinfo: this.state.lifeinfo + response.data.choices[0].text});
    //   this.setState({send_msgstatus: true});
    // }

    // else if(button_num === 3) { //If life info has some info in it already
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 5000,
    //     }
    //   })
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + this.state.skills + this.state.personality + this.state.lifeinfo
    //       + 'Generate the life history of this character such as their major life events, occupation, family, and relationships if these do not already exist:',
    //     temperature: 0.7,
    //     max_tokens: 512, //Increase amount to have longer story
    //   });
    //   this.setState({lifeinfo: this.state.lifeinfo + response.data.choices[0].text});
    //   this.setState({send_msgstatus: true});
    // }

    // //Chat Section
    // else if(button_num === 4) {
    //   this.setState({is_typing: true});
    //   var prompt = '';
    //   for (var i = 0; i < this.state.messages.length; i++) { //iterate over messages array
    //     var curr_msg = this.state.messages[i];
    //     if(curr_msg.id === 0) {
    //       prompt = prompt + "Me: " + curr_msg.message;
    //     }
    //     else if(curr_msg.id === 1) {
    //       prompt = prompt + curr_msg.message;
    //     }
    //     prompt = prompt + "\n";
    //   }
    //   const response = await openai.createCompletion("text-davinci-002", {
    //     prompt: this.state.worldinfo + this.state.basictraits + this.state.skills + this.state.personality + this.state.lifeinfo + prompt,
    //     temperature: 0.65,
    //     max_tokens: 256,
    //     stop: "Me:"
    //   });
    //   const prevState = this.state;
    //   const newMessage = new Message({
    //     id: 1, //you are id 0 and GPT-3 is 1
    //     message: response.data.choices[0].text,
    //     senderName: "Your character",
    //   });
    //   prevState.messages.push(newMessage);
    //   this.setState({is_typing: false});
    // }

    // //Reprocess for basic traits
    // else if(button_num === 5 && this.state.basictraits !== '') {
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 1500,
    //     }
    //   })
    //   const response = await openai.createEdit("text-davinci-edit-001", {
    //     input: this.state.basictraits,
    //     instruction: "Improve this by adding more detail about the character's traits",
    //   });
    //   this.setState({basictraits: response.data.choices[0].text});
    // }

    // //Reprocess for skills
    // else if(button_num === 6 && this.state.skills !== '') {
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 2000,
    //     }
    //   })
    //   const response = await openai.createEdit("text-davinci-edit-001", {
    //     input: this.state.skills,
    //     instruction: "Improve this by adding more detail about the character's skills",
    //   });
    //   this.setState({skills: response.data.choices[0].text})
    // }

    // //Reprocess for personality
    // else if(button_num === 7 && this.state.personality !== '') {
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 3000,
    //     }
    //   })
    //   const response = await openai.createEdit("text-davinci-edit-001", {
    //     input: this.state.personality,
    //     instruction: "Improve this by adding more detail about the character's personality",
    //   });
    //   this.setState({personality: response.data.choices[0].text})
    // }

    // //Reprocess for life info
    // else if(button_num === 8 && this.state.lifeinfo !== '') {
    //   Store.addNotification({
    //     title: "AI is Generating",
    //     message: "Please Wait...",
    //     type: "info",
    //     container: "top-left",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     width: 150,
    //     dismiss: {
    //       duration: 5000,
    //     }
    //   })
    //   const response = await openai.createEdit("text-davinci-edit-001", {
    //     input: this.state.lifeinfo,
    //     instruction: "Improve this by adding more detail about the character's life",
    //   });
    //   this.setState({lifeinfo: response.data.choices[0].text})
    // }
  }

  handleStoryChange(event) {
    // if (event.target.value !== '') { //if textarea has text in it, change status
    //   this.setState({ traitstatus: true })
    // }
    // else if (event.target.value === '') {
    //   this.setState({ traitstatus: false })
    // }
    this.setState({ storytext: event.target.value });
    this.setState({ storytext_cnt: Math.floor(event.target.value.length / 4) }); //TODO: make this word count and calculate max word count allowed based on tokens?
    //console.log(event.target.value);
  }

  handlePromptChange(event) {
    // if (event.target.value !== '') { //if textarea has text in it, change status
    //   this.setState({ traitstatus: true })
    // }
    // else if (event.target.value === '') {
    //   this.setState({ traitstatus: false })
    // }
    this.setState({ imageprompt: event.target.value });
    //console.log(event.target.value);
  }

  handleImageGenClick(event) {
    // event.preventDefault();
    // this.getGPTResponse(6);
  }

  handleIdeaGenBtn(event) {

  }

  handlePartialGenBtn(event) {

  }

  handleCompleteGenBtn(event) {

  }

  handleToneEditBtn(event) {

  }

  handleGenreEditBtn(event) {

  }

  handleErrorEditBtn(event) {

  }

  // handleTraitChange(event) {
  //   if(event.target.value !== '') { //if textarea has text in it, change status
  //     this.setState({skillstatus: true})
  //   }
  //   else if(event.target.value === '') {
  //     this.setState({skillstatus: false})
  //   }
  //   this.setState({basictraits: event.target.value});
  //   this.setState({basictraits_cnt: Math.floor(event.target.value.length / 4)});
  //   //console.log(event.target.value);
  // }

  // handleTraitClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(0);
  // }

  // handleTraitReClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(5);
  // }

  // handleSkillChange(event) {
  //   if(event.target.value !== '') { //if textarea has text in it, change status
  //     this.setState({personalitystatus: true})
  //   }
  //   else if(event.target.value === '') {
  //     this.setState({personalitystatus: false})
  //   }
  //   this.setState({skills: event.target.value});
  //   this.setState({skills_cnt: Math.floor(event.target.value.length / 4)});
  //   //console.log(event.target.value);
  // }

  // handleSkillClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(1);
  // }

  // handleSkillReClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(6);
  // }

  // handlePersonalityChange(event) {
  //   if(event.target.value !== '') { //if textarea has text in it, change status
  //     this.setState({lifeinfostatus: true})
  //   }
  //   else if(event.target.value === '') {
  //     this.setState({lifeinfostatus: false})
  //   }
  //   this.setState({personality: event.target.value});
  //   this.setState({personality_cnt: Math.floor(event.target.value.length / 4)});
  //   //console.log(event.target.value);
  // }

  // handlePersonalityClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(2);
  // }

  // handlePersonalityReClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(7);
  // }

  // handleLifeInfoChange(event) {
  //   if(event.target.value !== '') {
  //     this.setState({send_msgstatus: true})
  //   }
  //   else if(event.target.value === '') {
  //     this.setState({send_msgstatus: false})
  //   }
  //   this.setState({lifeinfo: event.target.value});
  //   this.setState({lifeinfo_cnt: Math.floor(event.target.value.length / 4)});
  //   //console.log(event.target.value);
  // }

  // handleLifeInfoClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(3);
  // }

  // handleLifeInfoReClick(event) {
  //   event.preventDefault();
  //   this.getGPTResponse(8);
  // }

  // handleSendMsgChange(event) {
  //   this.setState({send_msg: event.target.value});
  //   //console.log(this.state.send_msg);
  // }

  // handleSendMsgClick(event) {
  //   if(this.state.lifeinfo === '') { //Life info should not be empty when trying to chat with generated character
  //     alert('ERROR: life info must be filled in before attempting to chat with the character');
  //     return;
  //   }
  //   else if (this.state.send_msg === '') {
  //     alert('ERROR: please enter message to send');
  //     return;
  //   }
  //   else if(this.state.send_msg !== '' && this.state.lifeinfo !== '') {
  //     const prevState = this.state;
  //     const newMessage = new Message({
  //       id: 0, //you are id 0 and GPT-3 is 1
  //       message: this.state.send_msg,
  //       senderName: "you",
  //     });
  //     prevState.messages.push(newMessage);
  //     this.getGPTResponse(4);
  //     this.setState({send_msg: ''}); //make send_msg empty
  //     //console.log(this.state.messages);
  //   }
  // }

  render() {
    // const traitstatus = this.state.traitstatus;
    // const skillstatus = this.state.skillstatus;
    // const personalitystatus = this.state.personalitystatus;
    // const lifeinfostatus = this.state.lifeinfostatus;
    // const send_msgstatus = this.state.send_msgstatus;
    return (
      <div className="App">
        <header className="App-header">
          <ReactNotifications className="Notification" /> {/* TODO: Add image here after being generated */}
          <h1 className="Title"><a href="https://github.com/stephentambussi/StoryGenius">StoryGenius</a></h1>
          <h2 className="SubTitle">An AI-Powered Story Creator</h2>
        </header>

        <div className="StoryTemplate">

          <div className="ImageBox">

            <h2 className="ImageBoxHeader">Image</h2>

            <div className="frame">
              {/* TODO: Add image here after being generated */}
            </div>

            <div className="promptArea">
              <textarea name="imageprompt" rows="2" cols="50" value={this.state.imageprompt} onChange={this.handlePromptChange}
                placeholder="Image prompt goes here">
              </textarea>
              <button className="ImageGen" type="button" onClick={this.handleImageGenClick}>Manual Generate</button>
            </div>

          </div>

          <div className="TextEditor">
            <div className="generationButtons">
              <h4 className="genBtnHeader">Generate</h4>
              <button className="IdeaGen" type="button" onClick={this.handleIdeaGenBtn}>Story Idea</button>
              <button className="PartialGen" type="button" onClick={this.handlePartialGenBtn}>Finish Story</button>
              <button className="CompleteGen" type="button" onClick={this.handleCompleteGenBtn}>Full Story</button>
            </div>

            <p>
              <label htmlFor="story_textbox" name="StoryTextBoxTitle"><b>Tokens: {this.state.storytext_cnt} / {this.state.tokens_remaining}</b></label>
              <br />
              <textarea name="story_textbox" rows="7" cols="125" value={this.state.storytext} onChange={this.handleStoryChange}
                placeholder="Write or generate your short story here">
              </textarea>
            </p>

            <div className="editingButtons">
              <h4 className="editBtnHeader">Edit</h4>
              <button className="ToneEdit" type="button" onClick={this.handleToneEditBtn}>Alter the Tone</button>
              <button className="GenreEdit" type="button" onClick={this.handleGenreEditBtn}>Change the Genre</button>
              <button className="ErrorEdit" type="button" onClick={this.handleErrorEditBtn}>Fix Errors</button>
            </div>
          </div>

          <div className="UsageGuide">
            <h2 className="GuideHeader">Usage Guide</h2>
          </div>

          {/* <div className="BasicTraitsAndSkills">
            <div className="BasicTraits">
              <p>
                <b className="BasicTraitsTitle"> Basic Traits </b>
                {traitstatus 
                  ? <status-indicator positive></status-indicator> 
                  : <status-indicator negative pulse></status-indicator>
                }
                <button className="BasicTraitsGen" type="button" onClick={this.handleTraitClick}>Generate</button>
                <button className="BasicTraitsReGen" type="button" onClick={this.handleTraitReClick}>Reprocess</button>
                <b>Tokens: {this.state.basictraits_cnt}</b>
              <br />
                <textarea name="basic_traits_textbox" rows="6" cols="100" value={this.state.basictraits} onChange={this.handleTraitChange}
                  placeholder="This will be populated with the character's basic traits: name, age, gender, appearance,
                  race/species, etc. However, you can choose to create these traits yourself."> 
                </textarea>
              </p>
            </div>

            <div className="Skills">
              <p>
                <b className="SkillsTitle"> Skills </b>
                {skillstatus 
                  ? <status-indicator positive></status-indicator> 
                  : <status-indicator negative pulse></status-indicator>
                }
                <button className="SkillsGen" type="button" onClick={this.handleSkillClick}>Generate</button>
                <button className="SkillsReGen" type="button" onClick={this.handleSkillReClick}>Reprocess</button>
                <b>Tokens: {this.state.skills_cnt}</b>
              <br />
                <textarea name="skills_textbox" rows="6" cols="100" value={this.state.skills} onChange={this.handleSkillChange}
                  placeholder="This will be populated with the character's skills: physical and intellectual.
                  However, you can choose to create these details yourself."> 
                </textarea>
              </p>
            </div>

          </div> */}

          {/* <div className="Personality">
              <div className="PersonalityHeading">
                <b className="PersonalityTitle"> Personality </b>
                <br />
                {personalitystatus 
                  ? <status-indicator positive></status-indicator> 
                  : <status-indicator negative pulse></status-indicator>
                }
                <button className="PersonalityGen" type="button" onClick={this.handlePersonalityClick}>Generate</button>
                <br />
                {personalitystatus 
                  ? <status-indicator positive></status-indicator> 
                  : <status-indicator negative pulse></status-indicator>
                }
                <button className="PersonalityReGen" type="button" onClick={this.handlePersonalityReClick}>Reprocess</button>
              </div>

              <div className="PersonalityTextBox">
                <p>
                <br />
                  <textarea name="personality_textbox" rows="6" cols="150" value={this.state.personality} onChange={this.handlePersonalityChange}
                    placeholder="This will be populated with the character's personality traits: interests, behavioral quirks,
                    standard traits, etc. However, you can choose to create these details yourself."> 
                  </textarea>
                  <b className="PersonalityTokens">Tokens: {this.state.personality_cnt}</b>
                </p>
              </div>
          </div> */}

          {/* <div className="LifeInfo">
              <div className="LifeInfoHeading">
                <b className="LifeInfoTitle"> Life Info </b>
                <br />
                {lifeinfostatus 
                  ? <status-indicator positive></status-indicator> 
                  : <status-indicator negative pulse></status-indicator>
                }
                <button className="LifeInfoGen" type="button" onClick={this.handleLifeInfoClick}>Generate</button>
                <br />
                {lifeinfostatus 
                  ? <status-indicator positive></status-indicator> 
                  : <status-indicator negative pulse></status-indicator>
                }
                <button className="LifeInfoReGen" type="button" onClick={this.handleLifeInfoReClick}>Reprocess</button>
              </div>

              <div className="LifeInfoTextBox">
                <p>
                <br />
                  <textarea name="life_info_textbox" rows="6" cols="150" value={this.state.lifeinfo} onChange={this.handleLifeInfoChange}
                    placeholder="This will be populated with information about the character's life: major events, occupation,
                    family/relationships, etc. You can also choose to create these details yourself."> 
                  </textarea>
                  <b className="LifeInfoTokens">Tokens: {this.state.lifeinfo_cnt}</b>
                </p>
              </div>
          </div> */}

        </div>

        {/* <div className="Chat">
          <h2 className="ChatTitle">Character Chat</h2>
          <ChatFeed
            messages={this.state.messages} // Array: list of message objects
            isTyping={this.state.is_typing} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
          />
          <div className="SendMsg">
            <textarea name="send_msg_textbox" rows="2" cols="200" value={this.state.send_msg} onChange={this.handleSendMsgChange}
              placeholder="Enter here to send a message to the character you created."> 
            </textarea>
            <button className="SendMsgBtn" type="button" onClick={this.handleSendMsgClick}>SEND</button>
            {send_msgstatus 
              ? <status-indicator positive></status-indicator> 
              : <status-indicator negative pulse></status-indicator>
            }
          </div>
        </div> */}
      </div>
    );
  }
}

export default App;
