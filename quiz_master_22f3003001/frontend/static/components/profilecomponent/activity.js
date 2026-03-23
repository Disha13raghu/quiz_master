export default {
  
    template:`
          <div class="text-center">
            <h3 class="my-4 text-primary">Download the CSV File of the User Details</h3>
            
            <button class="btn btn-success" @click="download">
                <i class="bi bi-download"></i> Download 
            </button>
    </div>
    `,
    
    
    props:['user_id'],
    mounted(){
        this.$store.dispatch('checkAuthentication');
        this.getquiz()
          
    },
    computed:{
       s_id(){
        return this.$route.query.id 
    },
    role(){
        return this.$store.getters.getrole
    }
    },

    

    methods:{
        download: async function(){
            let rout="/user/csv"
            if (this.role==='admin'&& this.s_id){
              rout=`user/csv?${this.s_id}`
            }
            else if(this.role==='admin'){
                  rout='admin/csv'
            }

            let res= await fetch(rout,{
                 method:"POST",
                headers:{
                    "Authentication-Token":localStorage.getItem("auth_token"),
                    "Content-Type": "application/json"
                }
            })
            if (res.ok){
               let  data=await res.json()
               window.location.href = `/export_csv/${data.id}`;
            }

            
        },
       
 
    },
    components:{
    
    }




} 