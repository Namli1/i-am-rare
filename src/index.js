import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import logo from './assets/Round-Logo.svg';

// import { Router, hashHistory as history } from 'react-router';
// // Your routes.js file
// import routes from './routes';

// eslint-disable-next-line
function QuestionText(props) {
    return (
        <div className="questionText-box">
            <h3 className="question">
                {props.questionText}
            </h3>
        </div>
    );
}

function YesOrNoButton(props) {
    return (
        <div className="buttonBox">
            <button className="answerButton"
            onClick={props.onClick}>
                {props.answerText}
            </button>
        </div>
    );
}

function ChoiceField(props) {
    const [selectedValue, setSelectedValue] = useState("unselected");

    function handleChange(inputValue) {
        setSelectedValue(inputValue.value);
        //selectedValue = inputValue.value;
    }

    if (props.options.length <= 0) {
        //Just skip this question:
        props.onClick(null);
        return (
            <div>
            </div>
        );
    } else {
        var choiceOptions = props.options.map(function(option, index) {
            return {value: index, label: option.option};
        });
        return (
            <div className="select-row">
                <Select 
                options={choiceOptions}
                isSearchable={true} 
                className="choice-block-field choice-field" 
                value={selectedValue==="unselected" ? null : undefined}
                onChange={(inputValue) => handleChange(inputValue)}/>
                <button onClick={() => {
                    props.onClick(selectedValue);
                    setSelectedValue("unselected");
                }} className="choice-block-field choice-submit-button">Submit</button>
            </div>
        );
    }
}

function OddsView(props) {
    return (
        <div>
            <h1>Congratulations! You are {props.odds}% rare!</h1>
            {props.source != null ?
            <a href={props.source} class="source-link" target="_blank" rel="noopener noreferrer">&#9432; Source</a>
            : null
            }
            <p>Be sure to tell all your friends how rare you are!</p>
            <button onClick={props.onClick} className="generic-button">Play on</button>
        </div>
    );
}

function AllQuestionsPlayed(props) {
    return (
        <div>
            <h1>Respect!</h1>
            <p>You just played through all questions, you crazy nerd! 
                That means you played through {props.allQuestionsCount} questions!
                We hate to say it, but maybe just get a hobby.
                <br /> If you insist, you can restart the madness with the button below:
            </p>
            <button onClick={props.onClick} className="generic-button" >Restart game</button>
        </div>
    );
}

function toggleDropdown() {
    var triangle = document.getElementById("triangle");
    triangle.classList.toggle("upsidedown-transition");
    var tableContainer = document.getElementById("table-container");
    tableContainer.classList.toggle("height-transition");
    // if (element.classList.contains("animate-upsidedown")) {
    //     element.classList.toggle("animate-upsideup");
    // } else {
    //     element.classList.toggle("animate-upsideup");
    // }
}

function RarePercentageList(props) {
    return (
        <div className="table-container" id="table-container" onClick={ () => toggleDropdown() }>
            <div className="dropdown-button" id="dropdown-button">
                <div className="triangle_down" id="triangle"></div>
            </div>
            <table className="rarityTable">
                <thead>
                    <tr>
                        <th>Rarity</th>
                        <th>Question</th>
                    </tr>
                </thead>

                <tbody>
                { props.data.length === 0 ? 
                <tr>
                    <td className="rarity-cell">0%</td>
                    <td className="first-item">
                        <br />
                        <span style={{fontSize: "0.9rem"}}>
                            &emsp; &#8594; You ain't rare yet!
                        </span>
                    </td>
                </tr> 
                : 
                props.data.map((data, index) => {
                    const {rarity, question, choice} = data;
                    return (
                    <tr key={index}>
                        <td className="rarity-cell">{rarity}<span style={{fontSize:"2rem"}}>%</span></td>
                        <td className={(index === 0 ? 'first-item' : '')}>
                            {question}
                            <br/>
                            <span style={{fontSize: "0.9rem"}}>
                                &emsp; &#8594; {choice} 
                            </span>
                            </td>
                    </tr>)
                })}
                </tbody>
            </table>
        </div>
    );
}

class QuestionField extends React.Component {

    getAnswerField(questionType) {
        switch(questionType) {
            case "final":
            case "yesOrNo":
                return (
                    <div className="buttonWrapper">
                        <YesOrNoButton answerText="Yes" onClick={() => this.props.onSubmit(true)}/>
                        <YesOrNoButton answerText="No" onClick={() => this.props.onSubmit(false)}/>
                    </div>
                );
            case "choice":
                    return (
                    <ChoiceField options={this.props.questionOptions} onClick={this.props.onSubmit} />
                    );
            default:
                return (<p>Something went wrong!</p>)
        }
    }

    render() {
        return (
            <div>
                <div style={{display:"table", margin:"0 auto", marginBottom:"13px"}}>
                    <img src={logo} alt="Logo for I-Am-Rare website" width={"50rem"} style={{display:"table-cell", verticalAlign:"middle", marginRight:"5px", textAlign:"center"}}/>
                    <h1 style={{display:"table-cell", verticalAlign:"middle", textAlign:"center"}}>I Am Rare</h1>
                    </div>
                <div className="question-row">
                    <QuestionText questionText={this.props.questionText}/>
                </div>
                <div className="answer-row">
                    {this.getAnswerField(this.props.questionType)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        let alreadyPlayedBaseQuestionsFromLocalStorage = localStorage.getItem('alreadyPlayedBaseQuestions') === null || localStorage.getItem('alreadyPlayedBaseQuestions') === "undefined" ? [] : JSON.parse(localStorage.getItem('alreadyPlayedBaseQuestions'));
        if (alreadyPlayedBaseQuestionsFromLocalStorage.length === getData(alreadyPlayedBaseQuestionsFromLocalStorage.length).basequestions.length) {
            //If user played through all base questions, show him some respect!
            this.state = {
                gameView: "all-questions-played",
                rarityHistory: localStorage.getItem('rarityHistory') === null || localStorage.getItem('rarityHistory') === "undefined" ? [] : JSON.parse(localStorage.getItem('rarityHistory')),
            }
        } else {
            //Otherwise continue as normal
            var alreadyPlayedBaseQuestions = localStorage.getItem('alreadyPlayedBaseQuestions') === null || localStorage.getItem('alreadyPlayedBaseQuestions') === "undefined" ? [] : JSON.parse(localStorage.getItem('alreadyPlayedBaseQuestions'));
            var nextQuestionIndex = randomNumberExcluding(0, getData(alreadyPlayedBaseQuestions.length).basequestions.length, alreadyPlayedBaseQuestionsFromLocalStorage);
            this.state = {
                questionData: getData(alreadyPlayedBaseQuestions.length).basequestions,
                //Get random question Index, excluding nothing at first
                currentQuestion: nextQuestionIndex,
                currentBaseQuestion: nextQuestionIndex,
                questionCount: getData(alreadyPlayedBaseQuestions.length).basequestions.length,
                //Get local storage alreadyPlayedBasequestions, otherwise set empty array
                alreadyPlayedBasequestions: alreadyPlayedBaseQuestions,
                tempAlreadyPlayedQuestions: [],
                questionHistory: [],
                currentQuestionLevel: 0,
                gameView: "start",
                rarityHistory: localStorage.getItem('rarityHistory') === null || localStorage.getItem('rarityHistory') === "undefined" ? [] : JSON.parse(localStorage.getItem('rarityHistory')),
                // rarityHistory: [
                //     {"rarity": 0.1, "question": "Sample test that is like really really long, longer than Mount Everest", "choice": "Germany"},
                //     {"rarity": 10, "question": "Sample test 2", "choice": "Yes"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                //     {"rarity": 0.7, "question": "Sample test 3", "choice": "No"},
                // ]
            }
        }
    }

    //The odds for the "odds"-view
    odds;
    //The bool if it should continue on same level
    shouldContinueInLevel = false;

    handleSubmit(inputValue) {
        //These two are the same (structure), just set the questionData to the next "level" and then the game can just continue
        // console.log(getData().basequestions);
        // console.log(getData().basequestions[0].options[0].questions);
        // End of same

        ////There are three possibilities what level comes next: 
                //1. Type final: Show odds or next question
                //2. Type yesOrNo: Show next question with unclear type
                //3. Type options: Show the next question OR odds
        
        // switch (this.getQuestionType(this.state.questionData[this.state.currentQuestion])) {
            // ////1. Type final
            // case "final":
            if (inputValue === true && this.state.questionData[this.state.currentQuestion].yesOdds) {
                //If chose yes and there are yesOdds -> show Odds
                var yesOdds = this.state.questionData[this.state.currentQuestion].yesOdds;
                this.showOdds(yesOdds, "Yes");
            } else if (inputValue === true && this.state.questionData[this.state.currentQuestion].yes) {
                //If chose yes and there is yes-parameter -> show yes-Questions
                var newYesQuestions = this.state.questionData[this.state.currentQuestion].yes.questions;
                this.goQuestionLevelDeeper(newYesQuestions);
            } else if (inputValue === false && this.state.questionData[this.state.currentQuestion].noOdds) {
                //If chose no and there are noOdds -> show Odds
                var noOdds = this.state.questionData[this.state.currentQuestion].noOdds;
                this.showOdds(noOdds, "No");
            } else if (inputValue === false && this.state.questionData[this.state.currentQuestion].no) {
                //If chose no and there is no-parameter -> show no-Questions
                var newNoQuestions = this.state.questionData[this.state.currentQuestion].no.questions;
                this.goQuestionLevelDeeper(newNoQuestions);
            } else if(typeof inputValue === "number") {
                //If inputValue is a number, we have an options-type questions
                //So there are 2 possibilities:
                    //1. There are more questions
                    //2. There are yes or no Odds (Also means there might still be other questions)

                //1. There are more questions:
                if (this.state.questionData[this.state.currentQuestion].options[inputValue].questions) {
                    //We go one level deeper and set new questionData etc.
                    var questions = this.state.questionData[this.state.currentQuestion].options[inputValue].questions;
                    this.goQuestionLevelDeeper(questions);
                }
                //2. There are odds: (If still questions remaining show them after showing odds)
                else if (this.state.questionData[this.state.currentQuestion].options[inputValue].odds) {
                    var odds = this.state.questionData[this.state.currentQuestion].options[inputValue].odds;
                    var choice = this.state.questionData[this.state.currentQuestion].options[inputValue].option;
                    this.showOdds(odds, choice);
                }
            } else if (inputValue === "unselected") {
                //If inputValue === "unselected", then user hasn't selected anything in select-field
                alert("Trying to trick us? We noticed that you didn't select an option, so go do that before I can let you pass!"); 
            } else {
                //In all other cases, just set the next question
                this.setNextQuestion();
            }
    }

    getQuestionType(question) {
      if (question.options) {
          return "choice";
      } else if (question.yes || question.no) {
          return "yesOrNo";
      } else if (question.yesOdds || question.noOdds || question.odds) {
          return "final";
      } else {
          return null;
      }
  
  }

  goQuestionLevelDeeper(questions) {
    var newQuestionIndex = randomNumberExcluding(0, questions.length, []);
    this.setState({
        questionData: questions,
        questionCount: questions.length,
        //Get random current question and reset tempAlreadyPlayedQuestions with only currentQuestions
        currentQuestion: newQuestionIndex,
        //Append the current questions to the questionHistory array, along with the already played questions-Array
        questionHistory: this.state.questionHistory.concat(
            [{
                "questions": questions,
                "alreadyPlayedQuestions": [newQuestionIndex],
            },]
        ),
    });
  }

  setNextQuestion(question) {
    var levelFromBehind = 1; //Indicated how many levels up you should go 
    //(from behind because you subtract it from the last index), see below
    var currentLevelData = this.state.questionHistory[this.state.questionHistory.length - levelFromBehind]; //The data (=questions+alreadyPlayedQuestions) for the current level
    var isAtBaseLevel = true; //Default is true, can be set false below

    if(currentLevelData && currentLevelData.alreadyPlayedQuestions.length < currentLevelData.questions.length) {
        //If there are still questions at this level, use them
        isAtBaseLevel = false;
    } else {
        //Otherwise, loop through all levels or fallback to base questions
        //console.log(currentLevelData.alreadyPlayedQuestions.length >= currentLevelData.questions.length);
        while (currentLevelData && levelFromBehind <= this.state.questionHistory.length && currentLevelData.alreadyPlayedQuestions.length >= currentLevelData.questions.length) {
            //While there are no questions at this level, go up one level

            //As long as there are no questions at this level (i.e. more alreadyPlayed than there are questions), go up one level
            //Also checks if it's already at last level
    
            //Set base level to false for now, might be changed in if-statement below
            isAtBaseLevel = false;
            //So move one level up
            levelFromBehind += 1;
    
            if(levelFromBehind > this.state.questionHistory.length) {
                //If we went trough all levels, fallback to base level and break while-loop:
                isAtBaseLevel = true;
                break;
            }

            //Update the currentLevelData: (only if not already on base level)
            currentLevelData = this.state.questionHistory[this.state.questionHistory.length - levelFromBehind];
        }
    }

    //If we are not at base level, then get a new random question
    if (!isAtBaseLevel) {
        //Get new random questionIndex
        var newRandomQuestionIndex = randomNumberExcluding(0, currentLevelData.questions.length, currentLevelData.alreadyPlayedQuestions);
        //Update the questionHistory-Array with new alreadyPlayedQuestions
        var newQuestionHistory = this.state.questionHistory;
        newQuestionHistory[this.state.questionHistory.length - levelFromBehind].alreadyPlayedQuestions.push(newRandomQuestionIndex);
        this.setState({
            currentQuestion: newRandomQuestionIndex,
            questionData: currentLevelData.questions,
            //Set the questions history to current level, forget all levels below
            //(can't be played anyways because those questions are on alreadyPlayedQuestionsList-Array)
            questionHistory: newQuestionHistory,
            gameView: "game",
        });
    } else if(isAtBaseLevel) {
        //Add the current question to alreadyPlayedBaseQuestions
        var currentBaseQuestion = this.state.currentBaseQuestion;
        var newAlreadyPlayedBasequestions = this.state.alreadyPlayedBasequestions ? this.state.alreadyPlayedBasequestions.concat([currentBaseQuestion]) : [currentBaseQuestion];
        this.setState({
            //Append the current question to the already played array -> So only questions that were answered get appended
            alreadyPlayedBasequestions: newAlreadyPlayedBasequestions,
        }, () => {
            localStorage.setItem('alreadyPlayedBaseQuestions', JSON.stringify(this.state.alreadyPlayedBasequestions));
        });

        //Add +1 to alreadyPlayedBasequestions because you only append current question in the setState below
        if (getData(this.state.alreadyPlayedBasequestions.length).basequestions.length > this.state.alreadyPlayedBasequestions.length + 1) {
            //If there are still basequestions left, move on to the next one
            
            //Add current base question to alreadyPlayedBaseQuestions
            var newQuestionIndex = randomNumberExcluding(0, getData(this.state.alreadyPlayedBasequestions.length).basequestions.length, newAlreadyPlayedBasequestions);
            this.setState({
                questionData: getData(this.state.alreadyPlayedBasequestions.length).basequestions,
                currentQuestion: newQuestionIndex,
                currentBaseQuestion: newQuestionIndex,
                questionCount: getData(this.state.alreadyPlayedBasequestions.length).basequestions.length,
                //Reset the questionHistory
                questionHistory: [],
                gameView: "game",
            });
        } else {
            this.setState({
                gameView: "all-questions-played",
            });
        }
    }
  }

    playAgain() {
        this.setNextQuestion();
    }

    goBack() {

        if (this.state.questionHistory.length <= 1) {
            //If we are at base level or we were on the last question, get the question from the base questions
            var lastBaseQuestionIndex = this.state.alreadyPlayedBasequestions[this.state.alreadyPlayedBasequestions.length - 1];
            var lastQuestions = this.state.alreadyPlayedBasequestions.pop();


            this.setState({
                questionData: getData(this.state.alreadyPlayedBasequestions.length).basequestions,
                currentQuestion: lastBaseQuestionIndex,
                questionHistory: [],
                alreadyPlayedBasequestions: lastQuestions,
                gameView: "game",
            });
        } else {
            //Otherwise get the questions from the questionHistory
            if (this.state.questionHistory[this.state.questionHistory.length - 1].alreadyPlayedQuestions.length > 1) {
                //If more than one question played at this level, first go back to that question
                //var lastQuestions = this.state.questionHistory[this.state.questionHistory.length - 1].questions;
                //var lastQuestionIndex = this.state.questionHistory[this.state.questionHistory.length - 1].alreadyPlayedQuestions[this.state.questionHistory[this.state.questionHistory.length - 1].alreadyPlayedQuestions.length - 2];

                //var lastQuestionHistory = this.state.questionHistory;
                //lastQuestionHistory[this.state.questionHistory.length - 1].alreadyPlayedQuestions.pop();
            } else {
                //Otherwise go up one level
                var lastQuestions2 = this.state.questionHistory[this.state.questionHistory.length - 2].questions;
                var lastQuestionIndex = this.state.questionHistory[this.state.questionHistory.length - 2].alreadyPlayedQuestions[this.state.questionHistory[this.state.questionHistory.length - 2].alreadyPlayedQuestions.length - 1];

                var lastQuestionHistory = this.state.questionHistory;
                lastQuestionHistory[this.state.questionHistory.length - 2].alreadyPlayedQuestions.pop();
            }

            this.setState({
                questionData: lastQuestions2,
                currentQuestion: lastQuestionIndex,
                questionHistory: lastQuestionHistory,
                gameView: "game",
            });
        }
    }

    showOdds(rarity, choice) {
        this.odds = rarity;

        //saving odds in rarity list
        var rarityList = this.state.rarityHistory;
        rarityList.push(
            {"rarity": rarity, "question": this.state.questionData[this.state.currentQuestion].question, "choice": choice},
            );
        rarityList.sort(function(a,b) {
            return a.rarity - b.rarity;
        });
        this.setState({
            //Setting odds game-view
            gameView: "odds",
            rarityHistory: rarityList,
        }, () => {
            //Save it in local storage
            localStorage.setItem("rarityHistory", JSON.stringify(this.state.rarityHistory));
        });
    }

    restartGame() {
        console.log("RESTARTED!!!");
        var nextQuestionIndex = randomNumberExcluding(0, getData(0).basequestions.length, []);
        this.setState({
                questionData: getData(0).basequestions,
                //Get random question Index, excluding nothing at first
                currentQuestion: nextQuestionIndex,
                currentBaseQuestion: nextQuestionIndex,
                questionCount: getData(0).basequestions.length,
                //reset already Played Basequestions:
                alreadyPlayedBasequestions: [],
                questionHistory: [],
                gameView: "start",
                rarityHistory: [],
        }, () => {
            localStorage.setItem('alreadyPlayedBaseQuestions', JSON.stringify(this.state.alreadyPlayedBasequestions));
            localStorage.setItem('rarityHistory', JSON.stringify(this.state.rarityHistory));
        });
    }

  setGameView(gameView, odds) {
    switch(gameView) {
        case "start":
            this.setState({
                gameView: "start",
            });
            break;
        case "game":
            this.setState({
                gameView: "game",
            });
            break;
        case "odds":
            this.setState({
                gameView: "odds",
            });
            this.odds = odds;
            break;
        default:
            this.setState({
                gameView: "start",
            });
            break;
    }
  }

    render() {
        var gameViewComponent;

        switch(this.state.gameView) {
            case "start":
                gameViewComponent = <QuestionField 
                questionText={this.state.questionData[this.state.currentQuestion].question} 
                questionType={this.getQuestionType(this.state.questionData[this.state.currentQuestion])} 
                questionOptions={this.state.questionData[this.state.currentQuestion].options}
                onSubmit={(inputValue) => this.handleSubmit(inputValue)}
                />;
                break;
            case "game":
                gameViewComponent = <QuestionField 
                questionText={this.state.questionData[this.state.currentQuestion].question} 
                questionType={this.getQuestionType(this.state.questionData[this.state.currentQuestion])} 
                questionOptions={this.state.questionData[this.state.currentQuestion].options}
                onSubmit={(inputValue) => this.handleSubmit(inputValue)}
                />;
                break;
            case "odds":
                gameViewComponent = <OddsView odds={this.odds} source={this.state.questionData[this.state.currentQuestion].source} onClick={() => this.playAgain()}/>;
                break;
            case "all-questions-played":
                gameViewComponent = <AllQuestionsPlayed allQuestionsCount={getData(this.state.alreadyPlayedBasequestions.length).basequestions.length}
                onClick={() => this.restartGame()}/>
                break;
            default:
                gameViewComponent = <QuestionField 
                    questionText={this.state.questionData[this.state.currentQuestion].question} 
                    questionType={this.getQuestionType(this.state.questionData[this.state.currentQuestion])} 
                    questionOptions={this.state.questionData[this.state.currentQuestion].options}
                    onSubmit={(inputValue) => this.handleSubmit(inputValue)}
                />;
                break;
        }

        return (
            <div>
                <Popup
                    open={window.location.pathname === "i-am-rare/privacy-policy" || window.location.pathname === "/privacy-policy"}
                    modal
                    contentStyle={{width:'70%', margin:'3rem auto'}}
                    trigger={<footer style={{position:'absolute', bottom:'5px', right:'5px', color:'grey'}}><button style={{background:'none', border:'none', color:'inherit', font:'inherit', cursor:'pointer', outline:'inherit'}}>Privacy Policy</button></footer>}
                    >
                {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>
                        &times;
                        </button>
                        <div className="header"> Privacy Policy </div>
                        <div className="content">
                        {' '}
                            <p>At I Am Rare, accessible from www.namli1.github.io/i-am-rare, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by I Am Rare and how we use it.</p>

                            <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

                            <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in I Am Rare. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the <a href="https://www.privacypolicygenerator.info">Free Privacy Policy Generator</a>.</p>

                            <h2>Consent</h2>

                            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

                            <h2>Information we collect</h2>

                            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                            <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
                            <p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>

                            <h2>How we use your information</h2>

                            <p>We use the information we collect in various ways, including to:</p>

                            <ul>
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                            <li>Send you emails</li>
                            <li>Find and prevent fraud</li>
                            </ul>

                            <h2>Log Files</h2>

                            <p>I Am Rare follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

                            <h2>Cookies and Web Beacons</h2>

                            <p>Like any other website, I Am Rare uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

                            <p>For more general information on cookies, please read <a href="https://www.generateprivacypolicy.com/#cookies">"Cookies" article from the Privacy Policy Generator</a>.</p>

                            <h2>Google DoubleClick DART Cookie</h2>

                            <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a></p>


                            <h2>Advertising Partners Privacy Policies</h2>

                            <p>You may consult this list to find the Privacy Policy for each of the advertising partners of I Am Rare.</p>

                            <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on I Am Rare, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>

                            <p>Note that I Am Rare has no access to or control over these cookies that are used by third-party advertisers.</p>

                            <h2>Third Party Privacy Policies</h2>

                            <p>I Am Rare's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options. </p>

                            <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>

                            <h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>

                            <p>Under the CCPA, among other rights, California consumers have the right to:</p>
                            <p>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
                            <p>Request that a business delete any personal data about the consumer that a business has collected.</p>
                            <p>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p>
                            <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

                            <h2>GDPR Data Protection Rights</h2>

                            <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
                            <p>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>
                            <p>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p>
                            <p>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</p>
                            <p>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>
                            <p>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</p>
                            <p>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
                            <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

                            <h2>Children's Information</h2>

                            <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

                            <p>I Am Rare does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
                        </div>
                    </div>
                    )}
                </Popup>

                <div className="column-container">

                    <div style={{height:"100%"}}>
                        <RarePercentageList data={this.state.rarityHistory}/>
                    </div>


                    <div className="game">
                        <div className="game-view">
                            {gameViewComponent}
                        </div>
                    </div>
                </div>
                {/* <footer style={{position:'absolute', bottom:'5px', right:'5px', color:'grey'}}>Privacy Policy</footer> */}
            </div>
        )
    }
}


  // ========================================
  
  ReactDOM.render(
    //<Router routes={routes} history={history} />,
    <Game />,
    document.getElementById('root')
  );

  function getData(alreadyPlayedBasequestionsLength) {
      var data = require('./assets/questions.json');
      if (alreadyPlayedBasequestionsLength > 1) {
        var list1 = require('./assets/questions.json');
        var list2 = require('./assets/questions2.json');
        //Merging the two basequestion lists:
        var combined = list1.basequestions.concat(list2.basequestions);
        data = {
            'basequestions': combined,
        }
      } else {
        data = require('./assets/questions.json');
      }
      return data;
  }

  function randomNumberExcluding(min, max, excludedNumbers) {
      //If there are more excluded numbers than the range, exit function
    if (max-min <= excludedNumbers.length) {
        alert("Error: more excluded numbers than the range");
        return;
    }
      var number = Math.floor(Math.random() * (max-min) + min);
      //If number was already used, generate new random number
      while (excludedNumbers.includes(number)) {
        number = Math.floor(Math.random() * (max-min) + min);
      }
      return number;
  }