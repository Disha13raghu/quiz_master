import quiz from "./quiz.js" 
import graphs from "./graphs.js"
import update from "./update.js"
import graph_admin from "./graphs_admin.js"
import activity from "./activity.js"
export default {
  
    template:`
       <div class="container mt-4">
      <!-- Profile Details -->
      <div class="row mb-4">
        <div class="col-md-4 text-center">
          <img :src="'/static/images/profile_images/profile_' +students.id + '.jpg'"
               alt="Profile Image"
               class="img-fluid rounded shadow"
               style="height: 250px; width: 200px; object-fit: cover;">
           <update :formdata="students" v-if="role==='user'"></update>    
        </div>
        <div class="col-md-8">
          <div class="card shadow-sm p-3">
            <h3 class="card-title text-primary">{{ students.username }}</h3>
            <p><strong>Name:</strong> {{ students.f_name }} {{ students.l_name }}</p>
            <p><strong>Email:</strong> {{ students.email }}</p>
            <p><strong>DOB:</strong> {{ students.dob }}</p>
            <p><strong>Qualification:</strong> {{ students.qualification }}</p>
            <p><strong>Field:</strong> {{ students.field }}</p>
            <p>
              <strong>Status:</strong>
              <span :class="students.active ? 'text-success' : 'text-danger'">
                {{ students.active ? 'Active' : 'Inactive' }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="mt-3">
        <ul class="nav nav-pills nav-fill bg-light rounded shadow-sm">
          <li class="nav-item">
            <button class="nav-link " :class="{ active: activeTab === 'quizzes' }" @click="activeTab = 'quizzes'" v-if="s_id!=undefined || role!='admin'">
              Quizzes
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'performance' }" @click="activeTab = 'performance'">
              Performance
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'activity' }" @click="activeTab = 'activity'">
              Activity
            </button>
          </li>
        </ul>
      </div>

      <!-- Content Area -->
      <div class="mt-4">
        <div v-if="activeTab === 'quizzes'">
          <div >
            <quiz :user_id="students.id"></quiz>
          </div>

        </div>
        <div v-if="activeTab === 'performance'">
          <div v-if="s_id==undefined && role==='admin'">
              <graph_admin></graph_admin>
            
          </div>
          <div v-else>
              <graphs :user_id="students.id"></graphs>
          </div>
        </div>
        <div v-if="activeTab === 'activity'">
          <p class="text-muted"><activity></activity></p>
        </div>
      </div>
    </div>
           
    `,
    data(){
        return{
          students:[],
          
          activeTab:"performance"
        }
    },
    mounted(){
        this.$store.dispatch('checkAuthentication');
        this.studentdetails()
          
    },
 
    watch: {
    '$route.query.id'(newId, oldId) {
      if (newId !== oldId) {
        this.studentdetails()
      }
    }
  },

    computed:{
       role(){
        return this.$store.getters.getrole;
    },
    s_id(){
         return this.$route.query.id      
    },
    id(){
      return this.localStorage.getItem('id')
    }

    },

    methods:{
        studentdetails: async function(){  
           let rout = '';

          if (this.s_id) {
            rout = `/api/user_all/get/${this.s_id}`;
          } else {
            rout = `/api/user/get`;
          }
            
            let res= await fetch(rout,{
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
                  this.students=data[0]                
                }
                else{
                    throw new Error("No students data found")
                }
                
            })
            .catch(error=>{
                alert(error.message||error)
            })


        }
 
    },
    components:{
      quiz,
      graphs,
      update,
      graph_admin,
      activity
    }




} 