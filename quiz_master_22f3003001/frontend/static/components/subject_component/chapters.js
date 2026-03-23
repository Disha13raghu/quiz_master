import deletech from "./deletech.js"
import edit from "./edit.js"

export default {
    template: 
    `
        <div> 
            <form class="d-flex mt-3 floating_search" role="search">
                <input class="form-control me-2 " type="search" placeholder="Search" aria-label="Search" style="width:200px;" v-model="search">
                
            </form>
            <div class="list-group" v-if="n>=1">
                <div class="row" v-for="(chapter, index) in filtered" :key="chapter.id">
                    
                    <!-- Left Side: Chapter Button -->
                    <div class="col-md-10">
                        <router-link :to="{ name: 'chapter', params: { id: chapter.id } }">
                            <button type="button" class="list-group-item list-group-item-action" style="background-color:rgb(40, 48, 56); color: white; width: 100%; height: 60px; border: none; margin: 10px 0; border-radius: 10px;"aria-current="true">
                               {{ index + 1 }}. {{ chapter.name }} – {{ chapter.description }}
                            </button>
                        </router-link>
                    </div>

                    <!-- Right Side: Delete Component -->
                    <div class="col-md-1 d-flex align-items-center" v-if="role==='admin'">
                        <deletech :chid="chapter.id" @chapterdeleted="ch_details"></deletech>
                    </div>

                    <div class="col-md-1 d-flex align-items-center" v-if="role==='admin'"> 
                       <edit :chid="chapter.id" :chname="chapter.name" :chapdesc="chapter.description"   @chapedited="ch_details"></edit>
                    </div>

                </div>
           </div> 
           <div v-else>
                 {{message}}
           </div> 
      
        </div>
    `,
    data(){

        return {
            chapters:[],
            n:0,
            message:"",
            search:""
        }
    },
    computed:{
        subid() {
            return this.$route.params.id;
        },
        role(){
            return this.$store.getters.getrole;
        },
        filtered(){
        return this.chapters.filter(chapter=>chapter.name.toLowerCase().includes(this.search.toLowerCase()))
      }
        
       
    },
    beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.ch_details(); // call your data fetch method
    });
  },

    //props: ['subid'],

    mounted(){

           this.ch_details()
    },


    methods:{

         ch_details:async function() {       
            let res= await fetch(`/api/ch/get/${this.subid}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authentication-Token" :localStorage.getItem("auth_token")
                },

            })
            .then(response=>{
                if (response.ok){
                    this.n=1
                }
                else{
                    this.n=0
                }
                return response.json()
            })
                  
            
            .then(data=>{
                if (this.n===1){
                    console.log(data)
                    this.chapters=data
                }
                else{
                    throw new Error(data.message)
                }

            })
            .catch(error=>{
                console.error("error,fetched",error.message)
                this.n=0
                this.message=error.message
         })
        },
        addchap: async function(chap){
            console.log(chap)
            this.chapters.push(chap)
            this.n=1
        },

    },

    components: {
            deletech,
            edit,    
        },       
}    