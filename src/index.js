import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Select from 'react-select'

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
        console.log(selectedValue);
        console.log(selectedValue==="unselected" ? null : undefined);
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
                That means you played through {props.allQuestionCount} questions!
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
    console.log(props.data.length === 0 ? [{"rarity": 0, "question": "", "choice": "You ain't rare yet!"}] : props.data);

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
        console.log(questionType);
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
                <h1>I Am Rare</h1>
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
        console.log(localStorage.getItem('alreadyPlayedBaseQuestions'));
        let alreadyPlayedBaseQuestionsFromLocalStorage = localStorage.getItem('alreadyPlayedBaseQuestions') === null || localStorage.getItem('alreadyPlayedBaseQuestions') === "undefined" ? [] : JSON.parse(localStorage.getItem('alreadyPlayedBaseQuestions'));
        console.log(alreadyPlayedBaseQuestionsFromLocalStorage);
        if (alreadyPlayedBaseQuestionsFromLocalStorage.length === getData().basequestions.length) {
            //If user played through all base questions, show him some respect!
            this.state = {
                gameView: "all-questions-played",
                rarityHistory: localStorage.getItem('rarityHistory') === null || localStorage.getItem('rarityHistory') === "undefined" ? [] : JSON.parse(localStorage.getItem('rarityHistory')),
            }
        } else {
            //Otherwise continue as normal
            console.log(alreadyPlayedBaseQuestionsFromLocalStorage);
            var nextQuestionIndex = randomNumberExcluding(0, getData().basequestions.length, alreadyPlayedBaseQuestionsFromLocalStorage);
            console.log(localStorage.getItem('alreadyPlayedBaseQuestions'));
            this.state = {
                questionData: getData().basequestions,
                //Get random question Index, excluding nothing at first
                currentQuestion: nextQuestionIndex,
                currentBaseQuestion: nextQuestionIndex,
                questionCount: getData().basequestions.length,
                //Get local storage alreadyPlayedBasequestions, otherwise set empty array
                alreadyPlayedBasequestions: localStorage.getItem('alreadyPlayedBaseQuestions') === null || localStorage.getItem('alreadyPlayedBaseQuestions') === "undefined" ? [] : JSON.parse(localStorage.getItem('alreadyPlayedBaseQuestions')),
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
        console.log(this.state.alreadyPlayedBasequestions);
    }

    //The odds for the "odds"-view
    odds;
    //The bool if it should continue on same level
    shouldContinueInLevel = false;

    handleSubmit(inputValue) {
        console.log(inputValue);
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
                alert("yesOdds");
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
                alert("next question");
                //In all other cases, just set the next question
                this.setNextQuestion();
            }

            // else if (inputValue === false && this.state.questionData[this.state.currentQuestion].yesOdds) {
            //     //If chose no and there are yesOdds -> next question
            //     this.setNextQuestion();
            // } else if (inputValue === true && this.state.questionData[this.state.currentQuestion].noOdds) {
            //     //If chose yes and there are noOdds -> next question
            //     this.setNextQuestion();
            // }
            //     break;
            ////2. Type yesOrNo
            // case "yesOrNo":
                // if(inputValue === true && this.state.questionData[this.state.currentQuestion].yes) {
                //     var newQuestions = this.state.questionData[this.state.currentQuestion].yes.questions;
                //     this.goQuestionLevelDeeper(newQuestions);
                //     // this.setState({
                //     //     questionData: newQuestions,
                //     //     questionCount: newQuestions.length,
                //     //     currentQuestion: randomNumberExcluding(0, newQuestions.length, []),
                //     //     tempAlreadyPlayedQuestions: [this.currentQuestion],
                //     // });
                // } else if (inputValue === false && this.state.questionData[this.state.currentQuestion].no) {
                //     if (this.state.questionData[this.state.currentQuestion].no.odds) {
                //         //If there are odds for choosing no

                //     }
                //     var newQuestions = this.state.questionData[this.state.currentQuestion].no.questions;
                //     this.goQuestionLevelDeeper(newQuestions);
                //     // this.setState({
                //     //     questionData: newQuestions,
                //     //     questionCount: newQuestions.length,
                //     //     currentQuestion: randomNumberExcluding(0, newQuestions.length, []),
                //     //     tempAlreadyPlayedQuestions: [this.currentQuestion],
                //     // });
                // } else {
                //     this.setNextQuestion();
                // }
                // break;
            ///3. Type choice
            // case "choice":
                //inputValue needs to pass in index of chosen option, otherwise error
                //if(typeof inputValue === "number") {
                    //If inputValue is a number, we have an options-type questions
                    //So there are 2 possibilities:
                        //1. There are more questions
                        //2. There are yes or no Odds (Also means there might still be other questions)

                    //1. There are more questions:
                    //if (this.state.questionData[this.state.currentQuestion].options[inputValue].questions) {
                        //We go one level deeper and set new questionData etc.
                        //var questions = this.state.questionData[this.state.currentQuestion].options[inputValue].questions;
                        //this.goQuestionLevelDeeper(questions);
                        // var newQuestionIndex = randomNumberExcluding(0, questions.length, []);
                        // this.setState({
                        //     questionData: questions,
                        //     questionCount: questions.length,
                        //     //Get random current question and reset tempAlreadyPlayedQuestions with only currentQuestions
                        //     currentQuestion: newQuestionIndex,
                        //     //Include new currentQuestion in the reset tempAlreadyPlayedQuestions-Array
                        //     tempAlreadyPlayedQuestions: [newQuestionIndex],
                        // });
                    //}
                    //2. There are odds: (If still questions remaining show them after showing odds)
                //     else if (this.state.questionData[this.state.currentQuestion].options[inputValue].odds) {
                //         var odds = this.state.questionData[this.state.currentQuestion].options[inputValue].odds;
                //         this.showOdds(odds);
                //     } else {
                //         alert("Something went wrong");
                //     }
                // } else {
                //     alert("Something went wrong");
                // }
                // break;
            // default:
            //     alert("Something went wrong");
        //}


        // if (inputValue === true || inputValue === false) {
    
        // } 
        // ////2. Type yesOrNo
        // else if (typeof inputValue === "boolean" && this.state.questionData[this.state.currentQuestion].yes) {
        //     //If is a yesOrNoQuestion that goes further down a "level"
        //     alert("hello there");
        // }

        // ////3. Type options
        // else if (typeof inputValue === "number") {
            
        // }


        // var newQuestions = this.state.questionData[0].options[0].questions;
        // this.setState({
        //     questionData: newQuestions,
        //     questionCount: questions.length,
        // });
    }

    getQuestionType(question) {
    //   if (question.options) {
    //       alert("hiya");
    //       return "choice";
    //   } else if (question.yesOdds) {
    //       alert("hiya2");
    //     return "yesOrNo";
    //   }
  
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
      alert("going deeper");
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
                        
            console.log(this.state.questionHistory[this.state.questionHistory.length - levelFromBehind]);
            console.log("levelFromBehind: " + levelFromBehind);
            console.log("questionHistory length: " + this.state.questionHistory.length);

            //As long as there are no questions at this level (i.e. more alreadyPlayed than there are questions), go up one level
            //Also checks if it's already at last level
            console.log("while");
    
            //Set base level to false for now, might be changed in if-statement below
            isAtBaseLevel = false;
            //So move one level up
            levelFromBehind += 1;
    
            if(levelFromBehind > this.state.questionHistory.length) {
                alert("is at base");
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
        console.log(currentBaseQuestion);
        var newAlreadyPlayedBasequestions = this.state.alreadyPlayedBasequestions ? this.state.alreadyPlayedBasequestions.concat([currentBaseQuestion]) : [currentBaseQuestion];
        console.log(newAlreadyPlayedBasequestions);
        this.setState({
            //Append the current question to the already played array -> So only questions that were answered get appended
            alreadyPlayedBasequestions: newAlreadyPlayedBasequestions,
        }, () => {
            alert("Setting base level question in local storage");
            localStorage.setItem('alreadyPlayedBaseQuestions', JSON.stringify(this.state.alreadyPlayedBasequestions));
            console.log(this.state.alreadyPlayedBasequestions);
        });

        //Add +1 to alreadyPlayedBasequestions because you only append current question in the setState below
        if (getData().basequestions.length > this.state.alreadyPlayedBasequestions.length + 1) {
            //If there are still basequestions left, move on to the next one
            
            //Add current base question to alreadyPlayedBaseQuestions
            var newQuestionIndex = randomNumberExcluding(0, getData().basequestions.length, newAlreadyPlayedBasequestions);
            this.setState({
                questionData: getData().basequestions,
                currentQuestion: newQuestionIndex,
                currentBaseQuestion: newQuestionIndex,
                questionCount: getData().basequestions.length,
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
    // console.log(this.state.questionHistory[this.state.questionHistory.length - 1].alreadyPlayedQuestions);
    // if (this.state.currentQuestion + 1 < this.state.questionCount) {
    //     //If there are still other questions at this "level", then first pick one of them
    //     var newQuestionIndex = randomNumberExcluding(0, this.state.questionCount, this.state.tempAlreadyPlayedQuestions);
    //     this.setState({
    //         currentQuestion: newQuestionIndex,
    //         tempAlreadyPlayedQuestions: this.state.tempAlreadyPlayedQuestions.concat([newQuestionIndex]),
    //     });
    // } else if (getData().basequestions.length > this.state.alreadyPlayedBasequestions.length) {
    //     //If there are still basequestions left, move on to the next one
    //     var newQuestionIndex = randomNumberExcluding(0, getData().basequestions.length, this.state.alreadyPlayedBasequestions);
    //     this.setState({
    //         questionData: getData().basequestions,
    //         currentQuestion: newQuestionIndex,
    //         questionCount: getData().basequestions.length,
    //         //Append the new question to the already played array
    //         alreadyPlayedBasequestions: this.state.alreadyPlayedBasequestions.concat([newQuestionIndex]),
    //         //Reset the temporary already played questions array
    //         tempAlreadyPlayedQuestions: [],
    //         gameView: "game",
    //     });
    // } 
  }

    playAgain() {
        this.setNextQuestion();
    }

    goBack() {
        // if (this.state.alreadyPlayedBasequestions.length <= 1) {
        //     //If user hasn't played at least 2 questions, he can't go back
        //     alert("Play at least two questions to be able to go back!");
        //     return;
        // }

        if (this.state.questionHistory.length <= 1) {
            //If we are at base level or we were on the last question, get the question from the base questions
            var lastBaseQuestionIndex = this.state.alreadyPlayedBasequestions[this.state.alreadyPlayedBasequestions.length - 1];
            console.log(this.state.alreadyPlayedBasequestions);
            var lastQuestions = this.state.alreadyPlayedBasequestions.pop();


            this.setState({
                questionData: getData().basequestions,
                currentQuestion: lastBaseQuestionIndex,
                questionHistory: [],
                alreadyPlayedBasequestions: lastQuestions,
                gameView: "game",
            });
        } else {
            //Otherwise get the questions from the questionHistory
            console.log(this.state.questionHistory);
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
        console.log(rarity);
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
        console.log("RESTARTED HERE!!!");
        var nextQuestionIndex = randomNumberExcluding(0, getData().basequestions.length, []);
        this.setState({
                questionData: getData().basequestions,
                //Get random question Index, excluding nothing at first
                currentQuestion: nextQuestionIndex,
                currentBaseQuestion: nextQuestionIndex,
                questionCount: getData().basequestions.length,
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
            console.log("yesOdds called");
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

        console.log(this.state.gameView);

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
                gameViewComponent = <AllQuestionsPlayed allQuestionsCount={getData().basequestions.length} 
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
            </div>
        )
    }
}


  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function getData() {
      var data = require('./assets/questions.json');
      return data;
  }

  function randomNumberExcluding(min, max, excludedNumbers) {
      //If there are more excluded numbers than the range, exit function
    if (max-min <= excludedNumbers.length) {
        alert("more excluded numbers than the range");
        return;
    }
      var number = Math.floor(Math.random() * (max-min) + min);
      //If number was already used, generate new random number
      while (excludedNumbers.includes(number)) {
        number = Math.floor(Math.random() * (max-min) + min);
      }
      return number;
  }