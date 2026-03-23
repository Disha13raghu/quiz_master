export default {
    template: 
    `
    <div>
      
      <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
                 Add New Chapter
         </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label for="validationCustom001" class="form-label">name</label>
                  <input type="text" class="form-control" id="validationCustom001" v-model="formdata.name" required>
                </div>
                
                <div class="col-md-4">
                  <label for="validationCustom004" class="form-label">description</label>
                  <input type="text" class="form-control" id="validationCustom004" v-model="formdata.description" required>
                </div>
                
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="createchapter" data-bs-dismiss="modal" :disabled="formdata.name.trim() === '' || formdata.description.trim() === ''">Save changes</button>
           </div>
    </div>
  </div>
</div>
</div>

`
,

data: function(){
    return{
       formdata:{
           name:"", 
           description:"",
           
       },
    }

},
props:["subid"],
methods:{
    createchapter: async function(){
        console.log("Creating question for quiz:", this.subid)
           const ans= await fetch(`/api/ch/create/${this.subid}`,{
               method:"POST",
               headers:{
                   "Content-Type":"application/json",
                   "Authentication-Token": localStorage.getItem("auth_token"),
               },
               body: JSON.stringify(this.formdata)
               
           })
           .then(response => { return response.json()
               
                            })
                            
           .then(data => {
            this.$emit("chapcreated",data[0]);
            console.log(data[0])
               console.log(data.chapter)
               
           })
       }
}
}

