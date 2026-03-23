import questions from "./scorecardcomponent/questions.js"

export default {
    template: `
      <div> 
           <div>
              <h1 style="text-align:center;" >   QUIZ  Scores   {{marks}} Marks</h1>
           </div>

           <questions :quiz_id="quiz_id"></questions>
      
      </div>
    
    `,
    data(){
         return {
          scores:[],
          marks:0

         }
    },
    mounted(){
      this.$store.dispatch('checkAuthentication');
      this.getscores();
   },
   computed:{
      user_id(){
        return localStorage.getItem('id')
      },
      quiz_id(){
        return this.$route.params.id
      },
      u_id(){
        return this.$route.query.userid||undefined
      },
      role(){
        return this.$store.getters.getrole
      }
   },
   methods:{
    getscores:async function(){
       let uid=-1
       if (this.role==='admin'){
             uid=this.u_id
       }
       else{
        uid=this.user_id
       }
       
       let res= await fetch(`/api/score/get/${this.quiz_id}/${uid}`,{
        method:"GET",
          headers: {
          "Content-Type": "application/json",
          "Authentication-Token": localStorage.getItem("auth_token")
        }
       })
       if (res.ok){
           
         let data =await res.json()
         this.scores=data
         console.log(this.scores)
         if (this.scores.length>0){
            this.marks=this.scores[0].marks
         }
       }
       else{
         
        console.log("some internal error")
       }
    }
   },
   components: {
     questions
   }
}