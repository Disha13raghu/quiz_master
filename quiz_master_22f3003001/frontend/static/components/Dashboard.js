import createsub from "./dashboardchild/createsub.js"
import newquiz from "./dashboardchild/newquiz.js"
import subject from "./dashboardchild/subject.js"



export default {
    template: 
    `  
       
       <div> 
        <div v-if="isAuthenticated===true">
            <newquiz></newquiz>

            <br>
            <br>

            
           <div>
            <subject ref="subref"> </subject>
            </div>
         
           <div v-if="role === 'admin'">  
          
             <createsub @subjectcreated="subjectcreated">  </createsub>
          </div>
       </div>    
     </div>

     `,


    data: function(){

          return {
              userdata:"",
              subjectdata:[],
              token:"",
              subjectid:null,
              profile:"static/images/image.png",

          }

    },

    created(){
         this.$store.dispatch('checkAuthentication');
    },
     computed:{
          role() {
           return this.$store.getters.getrole; 
          },
            isAuthenticated() {

            return this.$store.getters.isAuthenticated;
          
    },
   
},
    mounted(){ 

      this.userdetails();

    } ,
   

   components:{
    "createsub":createsub,
    "newquiz":newquiz,
    "subject":subject,
   },


   methods:{

        userdetails: async function(){

            let ans= await fetch("/api/home",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token" :localStorage.getItem("auth_token")
                }
            })
            .then(response=> response.json() )
            .then(data=>{this.userdata=data;
                console.log(data)
                localStorage.setItem("role",data.role);
                this.$store.dispatch('setrole');
            }
)
        },
        subjectcreated: async function(sub){
            this.$refs.subref.addsub(sub)
        },    
        
    
   }
}