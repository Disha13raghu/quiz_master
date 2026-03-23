import options from "./options.js"

export default {

    template: `
      <div>
            <h2 style="text-align:center; border:2px solid black;">QUIZ</h2>
            <div style="margin-left:3px; border: 2px solid black; padding: 10px; border-radius: 4px;" v-if="questions.length>0">
                
                <form>
                  <div v-for="(question, index) in questions" :key="question.id"> 
                     <div class='row'>
                        <div class='col-md-10'>
                            <h3> Q{{index+1}}. {{ question.question_statement }}</h3>
                        </div>
                     </div>
                     <br>
                      <div>
                            <options :question=question ></options>
                      </div>

                      <div>
                               Correct Answer-<b>{{question.correct_ans}}</b>
                               
                      </div> 
                         
                       <br><br> <br>
                  </div> 
                </form>
            </div>      
                 
    </div>
    
    `,
   data(){
    return{
        questions:[]
    }
    
   },

    computed:{
         quiz_id(){
            return  this.$route.params.id;
         }  
    },
    mounted(){
        this.getquestions();
    },
    methods:{
        getquestions: async function(){
            let res=await fetch(`/api/qscore/get/${this.quiz_id}`,{
                method:"GET", 
                headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
                },
            })
            if (res.ok){
                
                let data= await res.json()
                console.log(data)
                this.questions=data
            }
            else{

            }
        },
    },
   components:{
    options
   }


}