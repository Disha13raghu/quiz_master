import useranswer from "./useranswer.js"

export default {
    template: `
      <div>
            <div style="text-align:center; ">
                      
                <div v-if="question.type==='MCQ'">
                           
                        <div v-if="options.length>0">
                            <div  v-for="(opt,index) in options" :key="opt.id">
                             
                                <div class="row">
                                    
                                            
                                    <div class="col-md-3" style="text-align:left;" :class=check(opt)>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" @change="answerSelected(opt.name)" :name='question.id' :id="question.id+'option'+opt.id" :value="opt.name" required disabled>
                                            <label class="form-check-label" for="question.id+'option'+opt.id">
                                                <b>{{index+1}}. {{opt.name}}</b>
                                            </label>
                                        </div>
                                    </div>
                                    
                                </div>  
                            </div>
                        </div>
                        <br>
                            
                    
                </div> 
                
                <div v-if="question.type === 'Q/A'" :class=check_q()>
                    <input 
                        type="text" 
                        class="form-control" 
                        name='question.id'
                        :id="'validationCustom007' + question.id" 
                        placeholder="Type your answer here"
                        v-model="useranswers.answer_chosen"
                        
                        required
                        disabled
                    >
                    <br>
                </div>
                <div style='text-align:left;' > chosen answer-  {{useranswers.answer_chosen}}</div>

            </div>
       </div>
    
    `,

    
props: ["question"],

data(){
return{
    options:[],
    useranswers:[]
}
},


 mounted: async function(){
    this.useranswerdetails(),
  this.option_cr()
  
 },
 computed:{
    role() {

      return this.$store.getters.getrole;
    
},
    question_id() {
      return  this.$route.params.id;
    },
    u_id(){
        return this.$route.query.userid||undefined
      },
     
    
   },

 methods:{
    option_cr :async function() {    

        fetch(`/api/option/get/${this.question.id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token" :localStorage.getItem("auth_token")
            },

        })
        .then(response=>{
            console.log(response)
           // this.options=[]
            return response.json()
            
        })
            
        .then(data=>{
            console.log(data)
            this.options=data  
            console.log(this.options) 
        }) 
        .catch(error=>{
            console.log("error",error)
        }) 
    },
    useranswerdetails:  async function(){
        let userid=-1
        if (this.role==='admin'){
             userid=this.u_id
        }
        else{
             userid=localStorage.getItem('id')
        }
         
        let res= await fetch(`/api/ans/get/${this.question.id}/${userid}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem('auth_token'),
            }
        })

        if (res.ok){
            let data=await res.json()
            console.log(data[0])
            this.useranswers=data[0]

        }
        else{
            console.log("error")
            alert("some error has occured")
        }
    },
    check:  function(option){
            let corr= this.question.correct_ans
            let user_ans= this.useranswers['answer_chosen']
            console.log("option",option.name)
            console.log(corr,user_ans)

            if (option.name==corr){
                console.log("correct")
                return "correct-answer"
            }
            else{
                console.log("wrong")
                if (option.name==user_ans){
                    
                    return "wrong-answer"
                }
            }

    },
    check_q:  function(){
            let corr= this.question.correct_ans
            let user_ans= this.useranswers['answer_chosen']
            console.log(corr,user_ans)

            
            if(user_ans==corr){
                console.log("right")               
                return "correct-answer"
                }
            else{
                return "wrong-answer"
            }    
            
        
    }
    

 },
 components:{
    useranswer
 }   
}