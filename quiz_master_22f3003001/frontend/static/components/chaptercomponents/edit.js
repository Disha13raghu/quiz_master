
export default {
    template: `
    <div>

      <button type="button" class="btn btn-dark" data-bs-toggle="modal" :data-bs-target="'#exampleModal'+quiz.id ">
                 Edit 
         </button>

            <!-- Modal -->
            <div class="modal fade" :id="'exampleModal'+quiz.id" tabindex="-1" :aria-labelledby="'exampleModalLabel'+quiz.id" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'exampleModalLabel'+quiz.id">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            
            <div class="modal-body">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-md-4">
                  <label :for="'validationCustom001'+quiz.id" class="form-label">name</label>
                  <input type="text" class="form-control" :id="'validationCustom001'+quiz.id" v-model="formdata.name" required>
                </div>
                
                <div class="col-md-4">
                  <label :for="'validationCustom004'+quiz.id" class="form-label">description</label>
                  <input type="text" class="form-control" :id="'validationCustom004'+quiz.id" v-model="formdata.description" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom005'+quiz.id" class="form-label">level</label>
                  <input type="text" class="form-control" :id="'validationCustom005'+quiz.id" v-model="formdata.level" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom002'+quiz.id" class="form-label">duration</label>
                  <input type="text" class="form-control" :id="'validationCustom002'+quiz.id" v-model="formdata.duration" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom009'+quiz.id" class="form-label">attempt</label>
                  <input type="text" class="form-control" :id="'validationCustom009'+quiz.id" v-model="formdata.attempt" required>
                </div>
                <div class="col-md-4">
                  <label :for="'validationCustom006'+quiz.id" class="form-label">deadline</label>
                  <input type="text" class="form-control" :id="'validationCustom006'+quiz.id" v-model="formdata.deadline" required>
                </div>
                
              </form>      
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="editquiz" data-bs-dismiss="modal" :disabled="formdata.name.trim() === '' || formdata.attempt.trim() === ''|| formdata.description.trim() === ''|| formdata.deadline.trim() === ''|| formdata.duration.trim() === '' || formdata.level === ''">Save changes</button>
           </div>
    </div>
  </div>
</div>
</div>


`,

data: function(){
    return{
       formdata:{
           name:this.quiz.name,
           level:this.quiz.level,
           duration:this.quiz.duration,
           deadline:this.quiz.deadline,
           attempt:this.quiz.attempt,
           description:this.quiz.description

           
       },
    }

},
props: ["quiz"],
methods:{
   editquiz: function(){
       fetch(`/api/quiz/update/${this.quiz.id}`,{
           method:"PUT",
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
        this.$emit("quizupdated",data[0])
        
           
       })
   }
}
}