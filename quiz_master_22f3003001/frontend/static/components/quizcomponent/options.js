import createoption from "./createoption.js";
import deleteo from "./deleteo.js";
import edito from "./edito.js";

export default {
    template: `
      <div>
            <div style="text-align:center; ">
                      
                <div v-if="question.type==='MCQ'">
                           
                        <div v-if="options.length>0">
                            <div  v-for="(opt,index) in options" :key="opt.id">
                             
                                <div class="row">
                                    
                                            
                                    <div class="col-md-3" style="text-align:left;">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" @change="answerSelected(opt.name)" :name='question.id' :id="question.id+'option'+opt.id" :value="opt.name" required>
                                            <label class="form-check-label" for="question.id+'option'+opt.id">
                                                {{index+1}}. {{opt.name}}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-1" v-if="role=='admin'">
                                            <edito :option="opt" @optionedited="option_cr(question.id)"></edito> 
                                    </div>
                                    <div class="col-md-1" v-if="role=='admin'">
                                            <deleteo :option_id="opt.id" @optiondeleted="option_cr(question.id)"></deleteo>
                                    </div>
                                </div>  
                            </div>
                        </div>
                        <br>
                            <div style="text-align:left; ">
                    
                                <createoption :questionid="question.id" @optioncreated="option_cr()" v-if="role==='admin'"> </createoption>
                                <br>
                           </div>
                    
                </div> 
                
                <div v-if="question.type === 'Q/A'">
                    <input 
                        type="text" 
                        class="form-control" 
                        name='question.id'
                        :id="'validationCustom007' + question.id" 
                        placeholder="Type your answer here"
                        @input="answerSelected($event.target.value)"
                        required
                    >
                    <br>
                </div>
            </div>
       </div>
    
    `,
props: ["question"],

data(){
return{
    options:[],
}
},


 mounted(){
  this.option_cr()
 },
 computed:{
    role() {

      return this.$store.getters.getrole;
    
},
    question_id() {
      return  this.$route.params.id;
    }
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
    option_created: function(option) {
      this.options.push(option);
    },
    option_edited: function(updatedOption) {
      const index = this.options.findIndex(opt => opt.id === updatedOption.id);
      if (index !== -1) {
        this.$set(this.options, index, updatedOption);
      }
    },
    option_deleted: function(deletedOptionId) {
      this.options = this.options.filter(opt => opt.id !== deletedOptionId);
    },
    answerSelected(value) {
        if (this.role==='user'){
            console.log("value",value)
           this.$emit("answer_chosen", { question_id: this.question.id, answer_chosen: value });
        }
    },
    

 },
 components:{
    createoption,
    deleteo,
    edito,
 }   
}