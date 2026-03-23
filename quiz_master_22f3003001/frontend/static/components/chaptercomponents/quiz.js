import deletequiz from "./deletequiz.js"
import edit from "./edit.js"

export default {
    template: `
      <div> 
            <form class="d-flex mt-3 floating_search" role="search">
                <input class="form-control me-2 " type="search" placeholder="Search" aria-label="Search" style="width:200px;" v-model="search">
                
            </form>
            <div class="row">
                <div v-for="quiz in filtered" :key="quiz.id" class="col-3 mb-4" >
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">{{quiz.name}}</h5>
                            <h6 class="card-subtitle mb-2 text-muted"> Level-{{quiz.level}},     {{quiz.attempt}} Attempt</h6>
                            <p class="card-text">{{quiz.description}}</p>
                            <div class="row">
                                <div v-if="role==='user'"> 
                                    <div class="col-md-6">
                                  
                                        <button v-if="checkdate(quiz.deadline)">
                                            <router-link :to="{ name: 'quiz', params: { id: quiz.id } }">
                                                <div>Takequiz</div>
                                            </router-link>
                                        </button>
                                        <button v-else>
                                                DeadlinePassed
                                        </button>
                                    </div> 
                                    <div class="col-md-6">
                                        <button>
                                            <router-link :to="{ name: 'scorecard', params: { id: quiz.id} }">
                                                    <div>ScoreCard</div>
                                            </router-link>
                                            
                                        </button>
                                    </div> 
                                </div>    
                                <div v-else>
                                    <div class="row">
                                        <div class="col">
                                            <button >
                                                <router-link :to="{ name: 'quiz', params: { id: quiz.id } }">
                                                    <div>Check</div>
                                                </router-link>
                                            </button>
                                        </div>    
                                        <div class="col">
                                              <button>
                                                  <router-link :to="{ name: 'Participants', params: { id: quiz.id } }">
                                                      <div>Students</div>
                                                  </router-link>
                                              </button>
                                        </div>
                                           
                                    </div>    
                                </div>     
                               
                            </div>    
                        </div>
                    </div>

                    <div class='row'>
                        <div class='col-2'>
                            <edit :quiz="quiz" @quizupdated="quiz_details" v-if="role==='admin'"></edit>
                        </div>
                        <div class='col-2'>
                           <deletequiz :quiz_id="quiz.id" @quizdeleted="quiz_details"  v-if="role==='admin'"></deletequiz>
                        </div>
                    </div>
                </div>
            </div>
           

      </div>
    `,

    //props:["ch_id"],
    data() {
        return {
            quizes: [],
            search:""
        };
    },
    computed:{
      ch_id() {
         return this.$route.params.id;

      },
      role(){
        return this.$store.getters.getrole;
     },
     filtered(){
        return this.quizes.filter(quiz=>quiz.name.toLowerCase().includes(this.search.toLowerCase()))
      }
   },
   
 

    mounted() {
        this.quiz_details();
         
    },
    methods: {
        async quiz_details() {
            try {
                let response = await fetch(`/api/quiz/get/${this.ch_id}`, {
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

                this.quizes = data;

            } catch (error) {
                this.quizes=[]
                console.error("Error fetching quizzes:", error.message);
            }
        },
        addquiz: async function(quiz){
            console.log(quiz)                                                                                        
            this.quizes.push(quiz)                                                     
        },
        checkdate(quiz_date){
            let curr_date=new Date()
            let date= new Date(quiz_date)
            return date>curr_date
        }
    },
    components: {
        deletequiz,
        edit,
       
    }, 
}    