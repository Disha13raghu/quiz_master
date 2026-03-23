
export default {
    template: `
    <div>

      <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#exampleModalquiz' + this.cid">
                 Create Quiz
         </button>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModalquiz' + this.cid" tabindex="-1" :aria-labelledby="'exampleModalLabelquiz' + this.cid" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'exampleModalLabelquiz' + this.cid">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label :for="'validationCustom001quiz' + this.cid" class="form-label">name</label>
                  <input type="text" class="form-control" :id="'validationCustom001quiz' + this.cid" v-model="formdata.name" required>
                </div>
                
                <div class="col-md-4">
                  <label :for="'validationCustom004quiz' + this.cid" class="form-label">description</label>
                  <input type="text" class="form-control" :id="'validationCustom004quiz' + this.cid" v-model="formdata.description" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom005quiz' + this.cid" class="form-label">level</label>
                  <input type="text" class="form-control" :id="'validationCustom005quiz' + this.cid" v-model="formdata.level" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom002quiz' + this.cid" class="form-label">duration</label>
                  <input type="number" class="form-control" :id="'validationCustom002quiz' + this.cid" v-model="formdata.duration" required>
                </div>
                <div class="col-md-4">
                       <label :for="'validationCustom009quiz' + this.cid" class="form-label">Attempt</label>
                          <select 
                            class="form-control" 
                            :id="'validationCustom009quiz' + this.cid" 
                            v-model="formdata.attempt" 
                            required
                          >
                            <option value="" disabled>Select Attempt</option>
                            <option value="Multiple">Multiple</option>
                            <option value="Single">Single</option>
                          </select>

                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom006quiz' + this.cid" class="form-label">deadline</label>
                  <input type="date" class="form-control" :id="'validationCustom006quiz' + this.cid" v-model="formdata.deadline" required>
                </div>
                
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="createquiz" data-bs-dismiss="modal" :disabled="formdata.name.trim() === '' || formdata.attempt.trim() === ''|| formdata.description.trim() === ''|| formdata.deadline.trim() === ''|| formdata.duration.trim() === '' || formdata.level.trim() === ''">Save changes</button>
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
           level:"",
           duration:"",
           deadline:"",
           attempt:"",
           description:""

           
       },
    }

},
props: ["cid"],

methods:{
   createquiz: function(){
       fetch(`/api/quiz/create/${this.cid}`,{
           method:"POST",
           headers:{
               "Content-Type":"application/json",
               "Authentication-token":localStorage.getItem("auth_token")

           },
           body: JSON.stringify(this.formdata)
           
       })
       .then(response => { 
          this.formdata.name=""
          this.formdata.level=""
          this.formdata.duration=""
          this.formdata.deadline=""
          this.formdata.attempt=""
          this.formdata.description=""
          return response.json()           
        })
                        
       .then(data => {
        console.log(data[0])
        this.$emit("quizcreated",data[0])
        
           
       })
   }
}
}