export default{


    template:`
    
    <div>
    
       <button type="button" class="btn btn-primary" @click="deletequiz">  Delete  </button>
        {{message}}
    </div>  
    
    `,
 data(){
return{
  message:"",
}
 },
 props:["quiz_id"],


    methods:{
       deletequiz: async function() {
        const res= await fetch(`/api/quiz/delete/${this.quiz_id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
            }

        })
        .then(result=>{return result.json()})
        
        .then(data=>{
            this.$emit("quizdeleted")
        })
        
       }
    }
    
    }