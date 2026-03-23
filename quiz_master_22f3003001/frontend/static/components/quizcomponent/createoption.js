
export default {
    template: `
    <div>
           <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#exampleModal1option' + questionid" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                 AddOption
         </button>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModal1option' + questionid" tabindex="-1" aria-labelledby="'exampleModalLabel1option' + questionid" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'exampleModalLabel1option' + questionid">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label :for="'validationCustom0011o+' + questionid" class="form-label">Option name</label>
                  <input type="text" class="form-control" :id="'validationCustom0011o+' + questionid" v-model="formdata.name" required>
                </div>
                
                
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="createoption" data-bs-dismiss="modal" :disabled="formdata.name.trim() === '' ">Save changes</button>
           </div>
    </div>
  </div>
</div>
</div>
`,
props:["questionid"],

data: function(){
    return{
       formdata:{
           name:"",     
       },
    }

},

methods:{
   createoption: async function(){
       fetch(`/api/option/create/${this.questionid}`,{
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
          this.$emit("optioncreated");
          this.formdata.name=""
           console.log(data)
           
       })
   }
}
}
