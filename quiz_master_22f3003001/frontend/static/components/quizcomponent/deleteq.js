export default{


    template:`
    
    <div>
    
       <button type="button" class="btn btn-primary" @click="deletequestion" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">  Delete  </button>
        {{message}}
    </div>  
    
    `,
 data(){
return{
  message:"",
}
 },
 props:["q_id"],


    methods:{
       deletequestion: async function() {
        console.log(this.q_id)
        const res= await fetch(`/api/ques/delete/${this.q_id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
            }

        })
        .then(result=>{return result.json()})
        
        .then(data=>{
            this.$emit("questiondeleted")
        })
        
       }
    }
    
    }