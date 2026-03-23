import createquestion from "./createquestion.js";
import deleteq from "./deleteq.js";
import editq from "./editq.js";
import options from "./options.js";
import submit  from "./submit.js"

export default {
    template: `
      <div>
       
      <h2 style="text-align:center; border:2px solid black;">QUIZ</h2>
           <h3 v-if="role !='admin'">  Time Left: {{ formattedTime }}</h3>
            <div style="margin-left:3px; border: 2px solid black; padding: 10px; border-radius: 4px;" v-if="questions.length>0">
                
                <form>
                  <div v-for="(question, index) in questions" :key="question.id"> 
                     <div class='row'>
                        <div class='col-md-10'>
                            <h3> Q{{index+1}}. {{ question.question_statement }}</h3>
                        </div>

                        <div class="col-md-1 px-0" v-if="role === 'admin'"> 
                              <editq :question=question @questionedited="questionEdited"></editq>
                        </div>  
                        <div class="col-md-1 px-0" v-if="role === 'admin'">   
                              <deleteq  :q_is=question.id @questiondeleted="questionDeleted"></deleteq>
                        </div>
                     </div>
                     <br>
                      <div >
                            <options :question=question @answer_chosen="updateAnswer"></options>
                      </div>

                      <div v-if="role === 'admin'" >
                               Correct Answer-<b>{{question.correct_ans}}</b>
                               
                      </div> 
                         
                       <br><br> <br>
                  </div> 
                </form>
                  
                <div  v-if="role==='user' && questions.length>0">
                   <submit :quiz_id="quiz_id" @submitting="submitAnswers" ref="submitBtn" :time="formattedTime"></submit>
                </div>       
            </div>  
            <div v-if="role === 'admin'" style="text-align:center;"> 
                       <createquestion :quizid="quiz_id" @questionCreated="addQuestion"></createquestion>
            </div>
              
    </div>
    
    `,


data(){
return{
    questions:[],
    answers:{},
    quiz:[],
    timeleft: 0,
    timerinterval: null,
    wait:0,
    card:[]
}
},
 
 
 mounted(){
  this.question_details()
  this.getcard()
  
  this.quiz_details().then(() =>
    {if (this.role !== 'admin' && this.quiz && this.quiz.duration) {
      const storageKey = `quiz_${this.quiz_id}_endtime`;
      const savedendtime = localStorage.getItem(storageKey);
      const now = Date.now();

      if (savedendtime) {
        const timeremaining = Math.floor((parseInt(savedendtime) - now) / 1000); // seconds
        this.timeleft = timeremaining > 0 ? timeremaining : 0;
      } else {
        const durationseconds = parseInt(this.quiz.duration) * 60;
        const endtime = now + durationseconds * 1000;
        localStorage.setItem(storageKey, endtime.toString());
        this.timeleft = durationseconds;
      }

      this.startTimer();
    }
  });
 },
 computed:{
    role() {

      return this.$store.getters.getrole;
},
quiz_id() {
    return this.$route.params.id;
  },
  formattedTime() {
    const minutes = Math.floor(this.timeleft / 60).toString().padStart(2, '0');
    const seconds = (this.timeleft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  },
  user_id(){
    return localStorage.getItem('id')
  } 
   },
  

 methods:{
   
    
   question_details: async function() {
    
      let res = await fetch(`/api/ques/get/${this.quiz_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authentication-Token": localStorage.getItem("auth_token")
        }
      });
      if (res.ok){
        let data = await res.json();  
        this.questions = data;

      } 
      else{
        console.log(res.json)
      }
      
    },
    addQuestion: function(question) {
      console.log("question pushed",question)
      this.questions.push(question);
    },
    questionEdited: function(updatedQuestion) {
      const index = this.questions.findIndex(q => q.id === updatedQuestion.id);
      if (index !== -1) {
        this.questions.splice(index, 1, updatedQuestion);
      }
    },
    questionDeleted: function(deletedQuestionId) {
      this.questions = this.questions.filter(q => q.id !== deletedQuestionId);
    },
    updateAnswer({ question_id, answer_chosen }) {
      this.answers[question_id] = answer_chosen;
      console.log("User answers:", this.answers);
  },
    submitAnswers: async function() {

      const allAnswered = this.questions.every(q => this.answers[q.id] && this.answers[q.id].trim() !== "");
    if (!allAnswered && this.wait==0) {
        alert("Please answer all questions before submitting.");
        return;
    }
    else{

        if (this.role==='user'){
        try {
          let payload = {
            quiz_id: this.quiz_id,
            user_id: localStorage.getItem('id'), 
            answers: Object.entries(this.answers).map(([question_id, answer_chosen]) => ({
              question_id: Number(question_id),
              answer_chosen
            }))
          };
          console.log(payload)
                    
          let res = await fetch(`/api/ans/create/${this.quiz_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("auth_token")
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error(` Error: ${res.status}`);
          let data = await res.json();
          console.log("Submitted answers:", data);



        } catch (err) {
          console.error("Error submitting answers:", err);
        }
      }
    }
    },
        startTimer() {
         this.timerinterval = setInterval(() => {
          if (this.timeleft > 0) {
            this.timeleft--;
          } else {
            clearInterval(this.timerinterval);
            this.wait=1
            localStorage.removeItem(`quiz_${this.quiz_id}_endtime`);
            this.$refs.submitBtn.submitNow();
          }
      }, 1000);
   },

    async quiz_details() {
            try {
                let response = await fetch(`/api/squiz/get/${this.quiz_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                });

                if (!response.ok) {
                    console.log(response.message)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                let data = await response.json();
                console.log("Fetched Quizzes:", data);

                this.quiz = data[0];

            } catch (error) {
                this.quiz=[]
                console.error("Error fetching quizzes:", error.message);
            }
        },
         getcard: async function(){
            await fetch(`/api/score/get/${this.quiz_id}/${this.user_id}`,{
                 method:"GET",
                headers:{
                    "Authentication-Token":localStorage.getItem("auth_token"),
                    "Content-Type": "application/json"
                }
            })
            .then(result=>{
                console.log("dsjak")
                return result.json()
                
            })
            .then(data=>{
                
                  this.card=data
                  let c=this.card[0]
                  console.log(c)
                  if (this.quiz.attempt!='Multiple'&& c.attempt>0){
                    alert("You have completed your single attempt")
                    this.$router.back()
                     clearInterval(this.timerinterval);
                      this.wait=1
                      localStorage.removeItem(`quiz_${this.quiz_id}_endtime`);
                  
                 }

                 
            })
            .catch(error=>{
                console.log(error)
            })
        }
    

 },
 components:{
    createquestion,
    deleteq,
    editq,
    options,
    submit
 }   
}