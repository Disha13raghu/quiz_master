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
    mounted(){
     this.$store.dispatch('checkAuthentication');
     this.getstudents()
          
    },

    computed:{
      role(){
        return this.$store.getters.getrole
      },
      filtered(){
        return this.students.filter(student=>student.username.toLowerCase().includes(this.search.toLowerCase()))
      }
    },

    methods:{
      getstudents: async function(){
        if (this.role!='admin'){
            this.$router.push("/dashboard")
        }
        await fetch("/api/user_all/get",{
            method:"GET",
            headers:{
                "Authentication-Token":localStorage.getItem('auth_token'),
                "Content-Type": "application/json"
            }
        })
        .then(res=>{
              return res.json()
        })
        .then(data=>{
            console.log(data)
            this.students=data
        })
        .catch(error=>{
            console.log(error)
        })
      }

    }








}