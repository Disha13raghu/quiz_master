import deletesub from "./deletesub.js"
import edit from "./edit.js"



export default {
    template: 
    `  
       <div> 
           <form class="d-flex mt-3 floating_search" role="search">
                <input class="form-control me-2 " type="search" placeholder="Search" aria-label="Search" style="width:200px;" v-model="search">
                
            </form> 
          <div class="container mt-4">
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
    <div class="col" v-for="subject in filtered" :key="subject.id">
      <div class="card h-100 shadow-sm">
        <img
          :src="'/static/images/subject_images/subject_' + subject.id + '.jpg?cb=' + (imageCacheBuster[subject.id] || '')"
          class="card-img-top"
          alt="Subject image"
          style="height: 180px; object-fit: cover;"
        />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">{{ subject.name }}</h5>
          <p class="card-text flex-grow-1">{{ subject.description }}</p>
          <router-link
            :to="{ name: 'subject', params: { id: subject.id } }"
            class="btn btn-primary mt-auto"
          >
            View Quiz <i class="bi bi-play-fill"></i>
          </router-link>
        </div>
        <div class="card-footer bg-transparent border-top-0" v-if="role === 'admin'">
          <div class="d-flex justify-content-between">
            <deletesub :subid="subject.id" @subjectdeleted="subjectdetails" />
            <edit :subid="subject.id"
                  :subname="subject.name"
                  :subdes="subject.description"
                  :subfield="subject.field"
                  @subupdated="subjectdetails"
                  @refreshimage="refreshImageCache" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

       </div>

     `,


    data: function(){

          return {
              subjectdata:[],
              subjectid:null,
              profile:"static/images/image.png",
              imageCacheBuster: {},
              m:0,
              search:""
          }

    },


    mounted(){ 

      this.subjectdetails(),
      this.$store.dispatch('checkAuthentication');
      

    } ,

    props:[],

   components:{
    "deletesub":deletesub,
    "edit":edit,
  
   },

   computed:{
    role() {

      return this.$store.getters.getrole;
    
},
      filtered(){
        return this.subjectdata.filter(subject=>subject.name.toLowerCase().includes(this.search.toLowerCase()))
      }
   },


   methods:{

        
        subjectdetails: async function(){

            let details= await fetch("api/sub/get",{
                method:"GET",
                headers:{"Content-Type":"application/json",
                    "Authentication-Token":localStorage.getItem("auth_token")
                }
            })
                .then(response=>{
                  if (response.ok){
                     this.m=1
                  }
                  else{
                    this.m=0
                  }

                  return response.json()
                })  
                .then(data=>{
                     if (this.m==1){
                      this.subjectdata=data
                      this.token=localStorage.getItem("auth_token")
                     }
                     else{
                      throw new Error(data.message)
                     }
                  })
                .catch(error=>{
                     console.log(error.message)
                })                    
        },
        addsub: async function(sub){
            console.log(sub)                                                                                        
            this.subjectdata.push(sub)                                                     
        },
        refreshImageCache(subjectId) {
          this.imageCacheBuster[subjectId] = Date.now(); // Cache-busting for image
        },
       

    
   }
}