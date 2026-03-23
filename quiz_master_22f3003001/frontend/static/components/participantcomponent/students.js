
export default {
  
    template:`
      <div> 
            <form class="d-flex mt-3 floating_search" role="search">
                <input class="form-control me-2 " type="search" placeholder="Search" aria-label="Search" style="width:200px;" v-model="search">
                
            </form>
           <div class="list-group" >
                <div class="row" v-for="(student, index) in filtered" :key="student.id">
                    
                    <!-- Left Side: Chapter Button -->
                    <div class="col-md-10">
                            <button type="button" class="list-group-item list-group-item-action" style="background-color:rgb(40, 48, 56); color: white; width: 100%; height: 60px; border: none; margin: 10px 0; border-radius: 10px;"aria-current="true">
                               
                               {{ index + 1 }}. {{ student.username }} – 
                            </button>
                    </div>

                    <!-- Right Side Component -->
                    <div class="col-md-1 d-flex align-items-center" >
                        <button> <router-link :to="{ name: 'profile', query: { id: student.id}}">
                                    <div>Profile</div>
                                </router-link></button>
                    </div>

                    <div class="col-md-1 d-flex align-items-center"> 
                      
                       <button> <router-link :to="{ name: 'scorecard', params: { id: quiz_id}, query: { userid: student.id } }">
                                    <div>ScoreCard</div>
                                </router-link>
                        </button>
                    </div>

                </div>
           </div> 
             


      </div>
           
    `,
    data(){
        return{
          students:[],
          search:""
        }
    },
    computed:{
       quiz_id(){
        return this.$route.params.id
    },
    role(){
        this.$store.getters.getrole;
    },
    filtered(){
        return this.students.filter(student=>student.username.toLowerCase().includes(this.search.toLowerCase()))
      }
    },
    mounted(){
       this.studentdetails()
    },
      
   
   

    methods:{
        studentdetails: async function(){
                
            let res= await fetch(`/api/userbyquiz/get/${this.quiz_id}`,{
                method:"GET",
                headers:{
                    "Authentication-Token":localStorage.getItem("auth_token"),
                    "Content-Type": "application/json"
                }
            })
            .then(result=>{
                return result.json()
            })
            .then(data=>{
                console.log(data[0])
                if (data.length>0){
                  this.students=data
                }
                else{
                    throw new Error("No students found")
                }
                
            })
            .catch(error=>{
                alert(error.message||error)
            })


        }
 
    },
    component:{
        
    }




} 