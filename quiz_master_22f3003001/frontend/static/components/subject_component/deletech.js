export default{


    template:`
    
    <div>
    
       <button type="button" class="btn btn-danger" @click="deletech">  Delete  </button>
        {{message}}
    </div>  
    
    `,
 data(){
return{
  message:"",
}
 },
 props:["chid"],


    methods:{
       deletech: async function() {
        const res= await fetch(`/api/ch/delete/${this.chid}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
            }

        })
        .then(result=>{
            if (result.ok){return result.json()}
            else{
                throw new Error(result.json())
            }
        })
       
        .then(data=>{
            this.$emit("chapterdeleted");
            console.log(data)
            })
        .catch(error=>{
            console.log(error.message.message)
            
        }
             
        )    
        
       }
    }
    
    }