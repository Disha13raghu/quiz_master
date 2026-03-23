export default {
    template: `
        <div>
                <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#modal-'+chid">
                    Update
                </button>

                <!-- Modal -->
                <div class="modal fade" :id="'modal-'+chid" tabindex="-1" :aria-labelledby="'modal-label-'+chid" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-header">
                                <h1 class="modal-title fs-5" :id="'modal-label-'+chid">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                    
                            <div class="modal-body">
                                    <form class="row g-3 needs-validation"  novalidate>

                                        <div class="col-md-4">
                                            <label for="validationCustom0010" class="form-label">Chapter Name</label>
                                            <input type="text" class="form-control" id="validationCustom0010" v-model="formdata.name" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label for="validationCustom0011" class="form-label">Chapter Description</label>
                                            <input type="text" class="form-control" id="validationCustom0011" v-model="formdata.description" required>
                                        </div>
                
                                        <div class="modal-footer" >
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-primary"  @click="editchapter" data-bs-dismiss="modal" :disabled="formdata.name.trim() === '' || formdata.description.trim() === ''">Save changes</button>
                                          
                                        </div>
                                                                                
                                    </form>      
                            </div>

                            

                        </div>
                    </div>
                </div>
        </div>
`,

data: function(){
    return{
       formdata:{
           name:"", 
           description:"",
           
       },
    }

  },
  
  
  mounted(){
    this.details()
  },
  props:["chid","chname","chapdesc"],
  methods:{
    editchapter: async function(){
        console.log("Creating question for quiz:", this.chid)
           const ans= await fetch(`/api/ch/update/${this.chid}`,{
               method:"PUT",
               headers:{
                   "Content-Type":"application/json",
                   "Authentication-Token": localStorage.getItem("auth_token"),
               },
               body: JSON.stringify(this.formdata)
               
           })
           .then(response => { return response.json()            
            })
                            
           .then(data => {
            this.$emit("chapedited");
            console.log(data)
               
           })
       },
       details: async function(){

        this.formdata.name=this.chname
        this.formdata.description=this.chapdesc
        console.log(this.chapdesc,this.chname)
       },
   }
}