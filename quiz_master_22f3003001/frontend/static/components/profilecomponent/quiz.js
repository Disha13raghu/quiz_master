
export default {
  
    template:`
          <div> 
               <div v-for="quiz in quizz">
                  <div class="row"> 
                        <div class="col">
                        <router-link :to="{ name: 'quiz', params: { id: quiz.id } }">
                        <button class="btn btn-primary mb-2" style="width:90%;text-align:center">{{quiz.name}} </button>
                        </router-link>
                        </div>
                        <div class="col  ">
                         <button>
                            <router-link :to="{ name: 'scorecard', params: { id: quiz.id},query:{userid: s_id} }">
                                <div>ScoreCard</div>
                            </router-link>
                                            
                         </button>
                        </div> 
                        <br>
                   </div>
               </div>

          </div>
         
    `,
    data(){
        return{
          quizz:[]
        }
    },
    props:['user_id'],
    mounted(){
        this.$store.dispatch('checkAuthentication');
        this.getquiz()
          
    },
    computed:{
       s_id(){
        return this.$route.query.id 
    }
    },

    

    methods:{
        getquiz: async function(){
           
            await fetch(`/api/quizbys/get/${this.user_id}`,{
                 method:"GET",
                headers:{
                    "Authentication-Token":localStorage.getItem("auth_token"),
                    "Content-Type": "application/json"
                }
            })
            .then(result=>{
                return result.json()
            })
            .then(data=>{
                console.log(data[0])
                if (data.length>0){
                  this.quizz=data
                 }
                 
            })
            .catch(error=>{
                console.log(error)
            })
        },
       
 
    },
    components:{
    
    }




} 