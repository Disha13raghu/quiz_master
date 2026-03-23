
export default {
    template:`
       <div> 
              <h1>Total Users: {{user}}</h1>
              <h1>Total Subjects: {{subjects}}</h1>
              <h1>Total Quiz: {{quiz}}</h1>
       </div>
    
    `,
    data(){
        return{
            user:0,
            subjects:0,
            quiz:0
        }
    },
    mounted(){
     this.details()
    },
    methods:{
        details:async function(){
            await fetch("/api/admindash",{
                method:"GET",
                headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
               }
            })
            .then(res=>{
                return res.json()
            })
            .then(data=>{

               
               console.log(data)
                this.user=data.users
                this.subjects=data.subjects
                this.quiz=data.quiz
            })
        }
    }
}