export default{


    template:`
    
    <div>
    
       <button type="button" class="btn btn-primary" @click="deletesub">  Delete  </button>
        {{message}}
    </div>  
    
    `,
 data(){
return{
  message:"",
}
 },
 props:["subid"],


    methods:{
       deletesub: async function() {
        const res= await fetch(`/api/sub/delete/${this.subid}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
            }

        })
        .then(result=>{
            return result.json()
        }
    
        )
        
        .then(data=>{
            this.$emit("subjectdeleted")
            this.message=data.message})
        
       }
    }
    
    }