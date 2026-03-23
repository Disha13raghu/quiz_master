export default {
    template: `
    <div>
           <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#exampleModaledit1:' + option.id" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                 Edit 
         </button>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModaledit1:' + option.id" tabindex="-1" :aria-labelledby="'exampleModalLabeledit1:' + option.id" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'exampleModalLabeledit1:' + option.id">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label :for="'validationCustom0011edito:' + option.id" class="form-label">Option name</label>
                  <input type="text" class="form-control" :id="'validationCustom0011edito:' + option.id" v-model="formdata.name" required>
                </div>
                
                
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="editoption" data-bs-dismiss="modal" :disabled="formdata.name.trim() === '' ">Save changes</button>
           </div>
    </div>
  </div>
</div>
</div>
`,
props:["option"],

data: function(){
    return{
       formdata:{
           name:this.option.name,     
       },
    }

},

methods:{
   editoption: async function(){
       console.log(this.option.id,"options are getting fetched",this.formdata.name)
       fetch(`/api/option/update/${this.option.id}`,{
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
          this.$emit("optionedited");
          this.formdata.name=""
           console.log(data)
           
       })
   }
}
}