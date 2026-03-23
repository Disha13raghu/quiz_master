
export default {
    template: `
     <div>
             <button  @click="submit" > SUBMIT</button>
      </div>
    `,
    computed:{
        user_id(){
            return localStorage.getItem("id")
        }

    },
    props:["quiz_id"],

    methods:{

        submitNow() {
                this.$emit('submitting'); 
            },
        submit: async function(){
           this.$emit("submitting");
           let user_id= localStorage.getItem('id'),
           res= await fetch(`/api/score/create/${this.quiz_id}/${user_id}`,{
               method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
                },
           })
           if (res.ok){
             console.log(res.json())
             alert("quiz Submitted")
           }
           else{
            console.log(res.json())
           }
           this.$router.back();
           
        }
    }
}


