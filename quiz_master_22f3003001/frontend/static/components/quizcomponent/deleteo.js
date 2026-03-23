export default{


    template:`
    
    <div>
    
       <button type="button" class="btn btn-primary " style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" @click="deleteoption">  Delete  </button>
        {{message}}
    </div>  
    
    `,
 data(){
return{
  message:"",
}
 },
 props:["option_id"],


    methods:{
       deleteoption: async function() {
        const res= await fetch(`/api/option/delete/${this.option_id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authentication-token":localStorage.getItem("auth_token")
            }

        })
        .then(result=>{return result.json()})
        
        .then(data=>{
            this.$emit("optiondeleted")
        })
        
       }
    }
    
    }